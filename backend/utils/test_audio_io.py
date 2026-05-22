import numpy as np
from services.dsp.audio_io import decode_audio

def make_test_wav(freq=440, duration=1.0, sample_rate=44100, n_channels=1):
    import wave, io, struct, math

    n_samples = int(sample_rate * duration)
    samples = [int(32767 * math.sin(2 * math.pi * freq * i / sample_rate))
               for i in range(n_samples)]

    if n_channels == 2:
        stereo_samples = []
        for s in samples:
            stereo_samples.extend([s, s])
        samples = stereo_samples

    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(n_channels)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(struct.pack(f"{len(samples)}h", *samples))

    return buf.getvalue()

def test_values_stay_in_range():
    wav = make_test_wav()
    result = decode_audio(wav)
    assert np.max(np.abs(result)) <= 1.0

def test_stereo_collapses_to_mono():
    wav_stereo = make_test_wav(n_channels=2)
    result = decode_audio(wav_stereo)
    assert result.ndim == 1

def test_resampling_preserves_duration():
    wav_22k = make_test_wav(sample_rate=22050, duration=2.0)
    result = decode_audio(wav_22k)
    expected_samples = int(44100 * 2.0)
    assert abs(len(result) - expected_samples) < 10