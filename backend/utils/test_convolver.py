import io
import wave
import math
import struct

import numpy as np

from services.dsp.hrtf import make_hrtf
from services.dsp.convolver import apply_binaural, encode_wav


def make_test_tone(freq=440, duration=1.0, sample_rate=44100):
    n_samples = int(sample_rate * duration)
    t = np.arange(n_samples) / sample_rate
    tone = 0.5 * np.sin(2 * np.pi * freq * t)
    return tone.astype(np.float32)


def test_output_is_stereo():
    mono = make_test_tone()
    hrtf_l, hrtf_r = make_hrtf(90.0, 0.0)

    stereo = apply_binaural(mono, hrtf_l, hrtf_r)

    assert stereo.ndim == 2
    assert stereo.shape[0] == len(mono)
    assert stereo.shape[1] == 2
    assert stereo.dtype == np.float32


def test_encode_wav_returns_bytes():
    mono = make_test_tone()
    hrtf_l, hrtf_r = make_hrtf(90.0, 0.0)
    stereo = apply_binaural(mono, hrtf_l, hrtf_r)

    wav_bytes = encode_wav(stereo)

    assert isinstance(wav_bytes, bytes)
    assert wav_bytes[:4] == b"RIFF"
    assert b"WAVE" in wav_bytes[:20]


def test_left_source_louder_in_left_ear():
    mono = make_test_tone()
    hrtf_l, hrtf_r = make_hrtf(90.0, 0.0)

    stereo = apply_binaural(mono, hrtf_l, hrtf_r)

    left = stereo[:, 0]
    right = stereo[:, 1]

    left_rms = np.sqrt(np.mean(left ** 2))
    right_rms = np.sqrt(np.mean(right ** 2))

    assert left_rms > right_rms