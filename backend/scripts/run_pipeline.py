# scripts/run_pipeline.py
from services.dsp.audio_io import decode_audio
from services.dsp.hrtf import make_hrtf
from services.dsp.convolver import apply_binaural, encode_wav

with open("test_tone.wav", "rb") as f:
    raw = f.read()

mono   = decode_audio(raw)
hrtf_l, hrtf_r = make_hrtf(azimuth_deg=90.0, elevation_deg=0.0)
stereo = apply_binaural(mono, hrtf_l, hrtf_r)
wav    = encode_wav(stereo)

with open("output_90_left.wav", "wb") as f:
    f.write(wav)

print("done — open output_90_left.wav with headphones")