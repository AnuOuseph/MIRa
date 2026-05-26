import wave
import numpy as np
from pathlib import Path

KEMAR_DIR = Path(__file__).parent.parent.parent / "hrtf_data" / "kemar"
SAMPLE_RATE = 44100

ELEVATIONS = [-40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90]

AZIMUTH_STEP = {
    -40: 6, -30: 6, -20: 6, -10: 6,
      0: 5,  10: 5,  20: 5,  30: 6,
     40: 6,  50: 8,  60: 10, 70: 15,
     80: 30, 90: None   # only az=0 exists at the top
}

def _snap(value, choices):
    return min(choices, key=lambda c: abs(c - value))

def _load_wav(path):
    with wave.open(str(path), 'rb') as wf:
        raw = wf.readframes(wf.getnframes())
        n_ch = wf.getnchannels()
    samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32767.0
    if n_ch == 2:
        stereo = samples.reshape(-1, 2)
        return stereo[:, 0], stereo[:, 1]
    return samples, samples

def load_kemar(azimuth_deg: float, elevation_deg: float = 0.0):
    az = azimuth_deg % 360
    snapped_el = _snap(elevation_deg, ELEVATIONS)

    mirrored = az > 180
    lookup_az = (360 - az) if mirrored else az

    step = AZIMUTH_STEP[snapped_el]
    available = [0] if step is None else list(range(0, 181, step))
    snapped_az = _snap(lookup_az, available)

    folder   = f"elev{snapped_el}"                    # ← subfolder
    filename = f"H{snapped_el}e{snapped_az:03d}a.wav"
    path     = KEMAR_DIR / folder / filename           # ← path includes folder

    if not path.exists():
        print(f"  KEMAR file not found: {path}, falling back to synthetic")
        from services.dsp.hrtf import make_hrtf
        return make_hrtf(azimuth_deg, elevation_deg)

    hrtf_l, hrtf_r = _load_wav(path)

    if mirrored:
        hrtf_l, hrtf_r = hrtf_r, hrtf_l

    return hrtf_l, hrtf_r