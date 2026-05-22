import numpy as np
from scipy.signal import fftconvolve
import wave, io

def apply_binaural(mono, hrtf_l, hrtf_r):
    left  = fftconvolve(mono, hrtf_l, mode='full')[:len(mono)]
    right = fftconvolve(mono, hrtf_r, mode='full')[:len(mono)]
    stereo = np.column_stack([left, right])
    peak = np.max(np.abs(stereo))
    if peak > 0:
        stereo = stereo / peak * 0.9
    return stereo.astype(np.float32)

def encode_wav(stereo, sample_rate=44100):
    pcm = (stereo * 32767).clip(-32767, 32767).astype(np.int16)
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm.tobytes())
    return buf.getvalue()