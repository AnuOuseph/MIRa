import librosa
import numpy as np


def normalize_vector(vector: np.ndarray) -> np.ndarray:
    norm = np.linalg.norm(vector)
    if norm == 0:
        return vector
    return vector / norm


def cosine_similarity(vector1: np.ndarray, vector2: np.ndarray) -> float:
    vector1 = normalize_vector(vector1)
    vector2 = normalize_vector(vector2)
    return float(np.dot(vector1, vector2))


def extract_similarity_features(file_path: str) -> dict:
    """
    Extracts feature groups useful for music similarity comparison.
    Uses first 30 seconds for consistency.
    """
    y, sr = librosa.load(file_path, sr=22050, mono=True, duration=30.0)

    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)

    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    tempo = float(tempo.item()) if hasattr(tempo, "item") else float(tempo)

    return {
        "mfcc": np.concatenate([
            np.mean(mfcc, axis=1),
            np.std(mfcc, axis=1)
        ]),
        "chroma": np.concatenate([
            np.mean(chroma, axis=1),
            np.std(chroma, axis=1)
        ]),
        "spectral_centroid": np.array([
            float(np.mean(spectral_centroid)),
            float(np.std(spectral_centroid))
        ]),
        "tempo": np.array([tempo])
    }


def get_similarity_label(score: float) -> str:
    if score >= 85:
        return "Very similar"
    if score >= 65:
        return "Moderately similar"
    if score >= 40:
        return "Somewhat similar"
    return "Quite different"