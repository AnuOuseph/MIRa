import math
import numpy as np

SAMPLE_RATE = 44100
HRTF_LEN    = 512   # impulse response length in samples
 
 
def make_hrtf(azimuth_deg: float, elevation_deg: float = 0.0):
    """
    Generate a synthetic HRTF pair for a given direction.
 
    Returns (hrtf_left, hrtf_right) as float32 numpy arrays of HRTF_LEN samples.
 
    Coordinate system:
        azimuth   0° = front, 90° = left, 180° = back, 270° = right
        elevation 0° = horizontal plane, +90° = directly above
    """
    az  = math.radians(azimuth_deg % 360)
    el  = math.radians(np.clip(elevation_deg, -40, 90))
 
    # 1. ITD (Woodworth formula) 
    # Head radius ~8.75cm, speed of sound 343 m/s
    # ITD = (r/c)(sin θ + θ) for |θ| ≤ π/2, else (r/c)(π - θ + sin θ)
    r = 0.0875
    c = 343.0
    theta = az if az <= math.pi else (2 * math.pi - az)  # convert to ±π
    theta = theta if az <= math.pi else -theta
 
    if abs(theta) <= math.pi / 2:
        itd_s = (r / c) * (math.sin(theta) + theta)
    else:
        sign = 1 if theta > 0 else -1
        itd_s = sign * (r / c) * (math.pi - abs(theta) + math.sin(abs(theta)))
 
    itd_samples = itd_s * SAMPLE_RATE  # can be fractional
 
    # 2. ILD
    # Head shadow: frequency-dependent attenuation on far ear
    # Approximated as: ILD(f) = A * (f/f0)^α * sin(θ)
    # where A≈20dB max, f0=1500Hz crossover, α controls slope
    ild_db = 20 * math.sin(theta) * 0.7   # up to ~14dB, sign follows near ear
 
    # 3. Build impulse responses 
    t = np.arange(HRTF_LEN, dtype=np.float32) / SAMPLE_RATE
 
    def make_channel(delay_s: float, gain_db: float, ear: str) -> np.ndarray:
        h = np.zeros(HRTF_LEN, dtype=np.float32)
 
        # Direct path — fractional delay via sinc interpolation
        delay_samp = delay_s * SAMPLE_RATE
        d_int  = int(delay_samp)
        d_frac = delay_samp - d_int
 
        sinc_len = 33
        sinc_center = sinc_len // 2
        sinc = np.sinc(np.arange(sinc_len) - sinc_center - d_frac)
        sinc *= np.hanning(sinc_len)
        sinc /= sinc.sum() + 1e-10
 
        start = max(0, d_int - sinc_center)
        end   = min(HRTF_LEN, d_int + sinc_center + 1)
        sstart = max(0, sinc_center - d_int)
        send   = sstart + (end - start)
        h[start:end] += sinc[sstart:send]
 
        # Pinna spectral shaping
        # Pinna creates direction-dependent notches/peaks
        # Elevation cue: notch around 8–10 kHz that moves with elevation
        # Front/back cue: notch around 4 kHz distinguishes front from back
 
        H = np.fft.rfft(h, n=HRTF_LEN)
        freqs = np.fft.rfftfreq(HRTF_LEN, d=1.0/SAMPLE_RATE)
 
        # Elevation notch (pinna shadow: 8kHz baseline, shifts up with elevation)
        el_notch_hz = 8000 + 4000 * math.sin(el)
        el_notch_q  = 5.0
        for f, i in zip(freqs, range(len(freqs))):
            if f > 0:
                ratio = f / el_notch_hz
                notch = 1.0 - 0.6 * math.exp(-0.5 * ((math.log(ratio) * el_notch_q) ** 2))
                H[i] *= notch
 
        # Front/back notch (~4kHz): front boosts, back attenuates
        fb_factor = math.cos(az)  # +1 front, −1 back
        fb_notch_hz = 4000.0
        for f, i in zip(freqs, range(len(freqs))):
            if f > 0:
                ratio = f / fb_notch_hz
                shape = math.exp(-0.5 * ((math.log(ratio + 1e-9) * 3.0) ** 2))
                H[i] *= (1.0 + 0.4 * fb_factor * shape)
 
        # High-freq head shadow (ILD is frequency-dependent above 1.5kHz)
        for f, i in zip(freqs, range(len(freqs))):
            freq_factor = min(1.0, f / 1500.0) if f > 0 else 0.0
            extra_db = gain_db * 0.5 * freq_factor  # up to extra 7dB
            H[i] *= 10 ** (extra_db / 20.0)
 
        h = np.fft.irfft(H, n=HRTF_LEN).astype(np.float32)
 
        # Normalize so energy is consistent across directions
        energy = np.sqrt(np.sum(h ** 2))
        if energy > 1e-6:
            h /= energy
            h *= 0.15  # scale to reasonable amplitude

        # Apply ILD gain after normalization
        h *= 10 ** (gain_db / 20.0)
 
        return h
 
    # Left ear is NEAR when source is on left hemisphere (az 0-180°)
    # Near ear: no delay, slight gain boost
    # Far ear:  delay = ITD, slight gain cut (head shadow)
    az_norm = azimuth_deg % 360
    if az_norm == 0 or az_norm == 180:
        # Exactly front or back: symmetric
        delay_l = delay_r = 0.0
        gain_l  = gain_r  = 0.0
    elif 0 < az_norm < 180:
        # Source on LEFT side: left ear is near (arrives first, no delay)
        delay_l = 0.0
        delay_r = abs(itd_s)      # right ear is far → delayed
        gain_l  =  abs(ild_db) * 0.5   # left ear gets slight boost
        gain_r  = -abs(ild_db) * 0.5   # right ear attenuated (head shadow)
    else:
        # Source on RIGHT side (az 180-360): right ear is near
        delay_l = abs(itd_s)      # left ear is far → delayed
        delay_r = 0.0
        gain_l  = -abs(ild_db) * 0.5   # left attenuated
        gain_r  =  abs(ild_db) * 0.5   # right boosted
 
    hrtf_l = make_channel(delay_l, gain_l, 'left')
    hrtf_r = make_channel(delay_r, gain_r, 'right')
    return hrtf_l, hrtf_r