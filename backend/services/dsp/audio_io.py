import wave
import io
import numpy as np
from scipy.signal import resample_poly
from math import gcd

TARGET_SR = 44100

def decode_audio(raw_bytes: bytes) -> np.ndarray:
    """
    Takes raw bytes of a WAV file.
    Returns mono float32 numpy array normalised to [-1.0, 1.0] at 44100 Hz.
    """
    buf = io.BytesIO(raw_bytes)

    with wave.open(buf, 'rb') as wf:
        n_channels  = wf.getnchannels()   # 1 = mono, 2 = stereo
        sample_width = wf.getsampwidth()  # bytes per sample: 1, 2, or 4
        sample_rate  = wf.getframerate()  # e.g. 44100, 22050, 48000
        n_frames     = wf.getnframes()    # total samples per channel
        raw_pcm      = wf.readframes(n_frames)

    # Decode int PCM → float32
    dtype_map = {1: np.int8, 2: np.int16, 4: np.int32}
    dtype = dtype_map[sample_width]
    divisor = float(np.iinfo(dtype).max)

    samples = np.frombuffer(raw_pcm, dtype=dtype).astype(np.float32) / divisor

    # Stereo → mono
    if n_channels == 2:
        samples = samples.reshape(-1, 2).mean(axis=1)
    elif n_channels > 2:
        samples = samples.reshape(-1, n_channels).mean(axis=1)

    # Resample to 44100 if needed
    if sample_rate != TARGET_SR:
        g = gcd(sample_rate, TARGET_SR)
        samples = resample_poly(
            samples, TARGET_SR // g, sample_rate // g
        ).astype(np.float32)

    return samples