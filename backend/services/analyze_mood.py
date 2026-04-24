import librosa
import numpy as np

def analyze_mood(file_path: str) -> dict:
    y, sr = librosa.load(file_path)
    
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    tempo = float(tempo.item())
    
    spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))
    
    # More nuanced mood detection
    energy = "low"
    if tempo > 130:
        energy = "very high"
    elif tempo > 110:
        energy = "high"
    elif tempo > 90:
        energy = "medium"
    else:
        energy = "low"
    
    valence = "positive" if spectral_centroid > 1500 else "negative"
    
    # Combine energy and valence for mood description
    mood_map = {
        ("high", "positive"): "energetic and uplifting",
        ("high", "negative"): "intense and dark", 
        ("medium", "positive"): "cheerful and bright",
        ("medium", "negative"): "melancholic and reflective",
        ("low", "positive"): "calm and peaceful",
        ("low", "negative"): "sad and somber"
    }
    
    primary_mood = mood_map.get((energy, valence), "neutral")
    
    return {
        "primary_mood": primary_mood,
        "energy_level": energy,
        "emotional_valence": valence,
        "brightness_score": float(spectral_centroid),
        "tempo_bpm": tempo
    }