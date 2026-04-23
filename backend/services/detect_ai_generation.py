import librosa
import numpy as np

def detect_ai_generation(file_path: str) -> dict:
    """
    Heuristic approach to detect AI-generated music.
    Note: This is a simplified approach - real detection requires specialized models.
    """
    y, sr = librosa.load(file_path)
    
    # Features that might indicate AI generation
    # 1. Unusual spectral characteristics
    spectral_flatness = np.mean(librosa.feature.spectral_flatness(y=y))
    
    # 2. Rhythm patterns
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
    tempo = float(tempo.item()) if hasattr(tempo, 'item') else float(tempo)
    
    # 3. Dynamic range 
    rms_energy = librosa.feature.rms(y=y)
    dynamic_range = np.max(rms_energy) - np.min(rms_energy)
    
    # Heuristic rules 
    ai_probability = 0.3  # Base probability
    
    # Adjust based on features
    if spectral_flatness < 0.1:  # Unusually flat spectrum
        ai_probability += 0.2
    if abs(tempo - 120) < 5:  # Very common tempo in AI music
        ai_probability += 0.1
    if dynamic_range < 0.05:  # Compressed dynamics
        ai_probability += 0.15
    
    ai_probability = min(0.95, max(0.05, ai_probability))  # Clamp between 5-95%
    
    return {
        "ai_generation_probability": round(ai_probability, 2),
        "human_generation_probability": round(1 - ai_probability, 2),
        "confidence": "low - heuristic approach",
        "features_analyzed": ["spectral_characteristics", "tempo_consistency", "dynamic_range"],
        "disclaimer": "This is a heuristic approximation. Professional AI detection requires specialized models and datasets."
    }