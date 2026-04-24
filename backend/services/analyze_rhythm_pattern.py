import librosa
import numpy as np

def analyze_rhythm_pattern(file_path: str) -> dict:
    y, sr = librosa.load(file_path)
    
    # Analyze rhythm complexity
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    tempo, beats = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr)
    
    # Calculate rhythm stability
    pulse = librosa.beat.plp(onset_envelope=onset_env, sr=sr)
    rhythm_stability = np.std(pulse)  # Lower = more stable rhythm
    
    return {
        "rhythm_complexity": "high" if rhythm_stability > 0.1 else "medium" if rhythm_stability > 0.05 else "low",
        "beat_consistency": "very consistent" if len(beats) > 10 else "moderate",
        "percussive_intensity": float(np.mean(onset_env))
    }