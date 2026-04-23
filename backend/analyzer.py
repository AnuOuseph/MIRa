# analyzer.py
import librosa
import numpy as np
from transformers import pipeline
from datetime import datetime
from services.analyze_instruments import analyze_instruments
from services.analyze_rhythm_pattern import analyze_rhythm_pattern
from services.analyze_mood import analyze_mood
from services.analyze_genre_simple import analyze_genre_simple
from services.analyze_structure import analyze_structure
from services.detect_ai_generation import detect_ai_generation


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

# Feature based music similarity function
def music_similarity(file_path1: str, file_path2: str) -> float:
    """
    Compares two audio files and returns a similarity score between 0 and 1.
    This is a very basic implementation based on tempo and key similarity.
    """

    return file_path1, file_path2, 0.75  # Placeholder for actual similarity score calculation
    

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