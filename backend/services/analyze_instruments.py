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