import librosa
import numpy as np

def analyze_genre_simple(file_path: str) -> list:
    y, sr = librosa.load(file_path)
    
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    tempo = float(tempo.item())
    
    # Additional features for better genre detection
    spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))
    zero_crossing = np.mean(librosa.feature.zero_crossing_rate(y))
    
    # Detect percussive vs melodic content
    harmonic, percussive = librosa.effects.hpss(y)
    percussive_ratio = np.mean(percussive) / (np.mean(harmonic) + 1e-10)
    
    genre_predictions = []
    
    # High percussion content suggests different genres
    if percussive_ratio > 0.8:
        if tempo > 115:
            genre_predictions.append({"genre": "Hip-Hop", "confidence": 0.8})
            genre_predictions.append({"genre": "Electronic", "confidence": 0.7})
        else:
            genre_predictions.append({"genre": "R&B", "confidence": 0.75})
            genre_predictions.append({"genre": "Funk", "confidence": 0.65})
    
    # Jazz/Blues for medium tempo, lower percussion
    elif 70 <= tempo <= 120 and percussive_ratio < 0.6:
        genre_predictions.append({"genre": "Jazz", "confidence": 0.75})
        genre_predictions.append({"genre": "Blues", "confidence": 0.65})
    
    # Rock for brighter, faster tempo
    elif tempo > 110 and spectral_centroid > 1800:
        genre_predictions.append({"genre": "Rock", "confidence": 0.8})
        genre_predictions.append({"genre": "Pop", "confidence": 0.6})
    
    else:
        genre_predictions.append({"genre": "Pop", "confidence": 0.6})
        genre_predictions.append({"genre": "Contemporary", "confidence": 0.55})
    
    return genre_predictions[:3]