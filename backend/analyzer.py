# analyzer.py
import librosa
import numpy as np
from transformers import pipeline
from datetime import datetime

def analyze_instruments(file_path: str, top_k: int = 3) -> list:
    """
    Uses a pre-trained model to identify instruments in an audio file.
    Returns a list of the top K most likely instruments with confidence scores.
    """
    # Initialize the audio classification pipeline with a music-specific model
    # This model is specifically trained for musical instrument classification
    classifier = pipeline(
        "audio-classification", 
        model="MIT/ast-finetuned-audioset-10-10-0.4593"
    )
    
    # Run the model on the audio file
    predictions = classifier(file_path)
    
    # Format the results: get top K instruments with confidence scores
    top_instruments = []
    for i in range(min(top_k, len(predictions))):
        instrument = predictions[i]['label']
        confidence = round(predictions[i]['score'], 4)  # Round to 4 decimal places
        top_instruments.append({
            "instrument": instrument,
            "confidence": confidence
        })
    
    return top_instruments

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

def analyze_structure(file_path: str) -> dict:
    """
    Basic song structure analysis identifying sections.
    """
    y, sr = librosa.load(file_path)
    
    # Onset detection for section changes
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    
    # Find tempo and beats
    tempo, beats = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr)
    
    # Simple structure analysis 
    total_beats = len(beats) if beats is not None else 0
    
    # Estimate sections based on beat patterns
    estimated_sections = max(3, min(6, total_beats // 32))  # Rough estimate
    
    return {
        "estimated_sections": estimated_sections,
        "total_beats": total_beats,
        "section_length_estimate": f"{total_beats // estimated_sections} beats per section",
        "analysis_note": "Basic structure detection - advanced algorithms would provide verse/chorus/bridge identification"
    }

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

def analyze_audio(file_path: str) -> dict:
    """
    Takes a path to an audio file and returns a dictionary
    with its tempo, key, loudness, and instruments.
    """
    # Load the audio file
    y, sr = librosa.load(file_path)

    # 1. Calculate Tempo (Beats Per Minute)
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    tempo_value = float(tempo.item())

    # 2. Estimate Key (Tonality)
    chromagram = librosa.feature.chroma_stft(y=y, sr=sr)
    chroma_agg = np.mean(chromagram, axis=1)
    notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    key_index = np.argmax(chroma_agg)
    estimated_key = notes[key_index]

    # 3. Calculate Loudness (Root Mean Square Energy)
    rms_energy = librosa.feature.rms(y=y)
    average_loudness = float(np.mean(rms_energy))

    # 4. Run all analyses
    instruments = analyze_instruments(file_path)
    rhythm = analyze_rhythm_pattern(file_path)
    genres = analyze_genre_simple(file_path)
    mood = analyze_mood(file_path)
    structure = analyze_structure(file_path)
    ai_detection = detect_ai_generation(file_path)

    # 5. Package comprehensive results
    analysis_results = {
        "basic_analysis": {
            "tempo_bpm": tempo_value,
            "key": estimated_key,
            "average_loudness": average_loudness,
            "duration_seconds": len(y) / sr
        },
        "ai_analysis": {
            "instruments": instruments,
            "genres": genres,
            "mood": mood,
            "song_structure": structure
        },
        "generation_analysis": ai_detection,
        "metadata": {
            "analysis_version": "1.0",
            "features_available": ["tempo", "key", "loudness", "instruments", "genre", "mood", "structure", "ai_detection"],
            "timestamp": datetime.now().isoformat()
        }
    }

    return analysis_results

# Test the function directly if this file is run
if __name__ == "__main__":
    # TEST: Replace with your actual audio file name
    test_file = "test_audio.mp3"  # Change this to your file name!
    try:
        results = analyze_audio(test_file)
        print("✅ Analysis Successful!")
        print("Results:", results)
    except Exception as e:
        print("❌ Error:", e)
        print("Make sure you have an audio file named 'test_audio.mp3' in this folder.")