# MIRa — Music Information Retrieval Analysis

> An end-to-end system for extracting and visualizing semantic audio features from music files, combining classical signal processing with transformer-based classification models.

![MIRa upload interface](./images/upload.png)
![MIRa analysis results](./images/results.png)

**[Live Demo](https://anuouseph-mira.vercel.app)** · **[API (Hugging Face Spaces)](https://anuouseph-mira-music-analysis-api.hf.space/docs)**

---

## Overview

MIRa is a music analysis system built to explore how audio signal processing and machine learning models can be combined into a practical, usable interface. The system accepts an audio file and returns a structured set of features covering tonal, rhythmic, timbral, and affective dimensions of the track.

The project is motivated by core MIR research tasks — automatic annotation, genre classification, mood inference, and generative AI detection — and serves as a foundation for further work in music similarity and recommendation.

---

## Features Extracted

| Feature | Method | Output |
|---|---|---|
| Tempo | Librosa beat tracking | BPM |
| Musical Key | Chroma-based key estimation | Key name |
| Loudness | RMS energy analysis | Normalized value |
| Duration | Audio metadata | Seconds |
| Instrument Detection | Hugging Face audio classifier | Label + confidence % |
| Genre Classification | Transformer-based model | Top genres + confidence % |
| Mood / Affect | Valence-arousal heuristics | Label, energy, valence |
| AI vs Human Detection | Spectral heuristic analysis | Human/AI probability % |

---

## Technical Approach

**Signal Processing Layer** — Low-level features (tempo, key, loudness) are extracted using Librosa, which applies beat tracking, chroma short-time Fourier transforms, and RMS energy analysis to the raw audio waveform. These methods are well-established in the MIR literature and provide interpretable, reproducible outputs.

**Classification Layer** — Higher-level semantic features (genre, instrument, mood) are produced by fine-tuned Hugging Face Transformer models trained on audio classification tasks. These models operate on mel-spectrogram representations of the audio.

**Limitations & Future Work** — The current genre classifier performs well on broad categories but struggles with subgenre distinction, a known challenge in MIR (Tzanetakis & Cook, 2002). The AI detection module is a heuristic approximation based on spectral regularity — production-grade detection would require specialized models and labelled datasets (e.g., Donahue et al., 2023). Future development will explore music similarity computation using cosine distance over MFCC and chroma feature vectors, enabling track comparison and recommendation.

---

## System Architecture

```
Audio File (MP3/WAV)
      │
      ▼
┌─────────────────────────────┐
│     FastAPI Backend          │
│  ┌──────────────────────┐   │
│  │  Signal Processing   │   │  ← Librosa: tempo, key, loudness
│  │  (analyzer.py)       │   │
│  ├──────────────────────┤   │
│  │  ML Classification   │   │  ← HF Transformers: genre, instrument, mood
│  │  (HF Pipelines)      │   │
│  └──────────────────────┘   │
│     REST API /analyze        │
└─────────────────────────────┘
      │
      ▼
┌─────────────────────────────┐
│   Next.js Frontend           │
│   Feature Visualization      │  ← Confidence scores, genre bars, mood labels
└─────────────────────────────┘
```

---

## Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.10, FastAPI, Uvicorn |
| Signal Processing | Librosa, NumPy, SoundFile |
| ML Models | Hugging Face Transformers, Torch |
| Audio I/O | FFmpeg, libsndfile |
| Frontend | Next.js 14, React, Tailwind CSS |
| Deployment | Hugging Face Spaces (Docker) + Vercel |

---

## Running Locally

**Backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# FFmpeg required: brew install ffmpeg (macOS) or apt install ffmpeg (Linux)
uvicorn main:app --reload
# API docs at http://localhost:7860/docs
```

**Frontend**
```bash
cd frontend
npm install
# Set NEXT_PUBLIC_API_URL=http://localhost:3000 in .env.local
npm run dev
```

---

## Planned Extensions

- **Music similarity** — cosine distance over MFCC/chroma vectors for track comparison
- **Automatic annotation evaluation** — benchmark against GTZAN dataset with accuracy reporting
- **Waveform & spectrogram visualization** — display audio features visually in the frontend using WaveSurfer.js
- **Recommendation prototype** — nearest-neighbour search over a feature vector index

---

## References

- Tzanetakis, G. & Cook, P. (2002). Musical genre classification of audio signals. *IEEE Transactions on Speech and Audio Processing.*
- McFee, B. et al. (2015). librosa: Audio and music signal analysis in Python. *Proceedings of the 14th Python in Science Conference.*
- Défossez, A. et al. (2022). High fidelity neural audio compression. *arXiv:2210.13438.*

---

[Portfolio](https://anuouseph.vercel.app) · [LinkedIn](https://linkedin.com/in/anuouseph) · [GitHub](https://github.com/AnuOuseph)