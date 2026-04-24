import numpy as np
from utils.audio import cosine_similarity
from utils.audio import extract_similarity_features
from utils.audio import get_similarity_label


# Feature based music similarity function
def compare_audio_files(file1_path: str, file2_path: str) -> dict:
    features1 = extract_similarity_features(file1_path)
    features2 = extract_similarity_features(file2_path)

    feature_scores = {}

    for feature_name in features1:
        score = cosine_similarity(features1[feature_name], features2[feature_name])
        score_percent = max(0.0, min(100.0, score * 100))
        feature_scores[feature_name] = round(score_percent, 2)

    vector1 = np.concatenate([
        features1["mfcc"],
        features1["chroma"],
        features1["spectral_centroid"],
        features1["tempo"]
    ])

    vector2 = np.concatenate([
        features2["mfcc"],
        features2["chroma"],
        features2["spectral_centroid"],
        features2["tempo"]
    ])

    weighted_score = (
        0.5 * feature_scores["mfcc"] +
        0.3 * feature_scores["chroma"] +
        0.15 * feature_scores["spectral_centroid"] +
        0.05 * feature_scores["tempo"]
    )

    overall_percent = max(0.0, min(100.0, weighted_score))

    vector_score = cosine_similarity(vector1, vector2)
    vector_percent = max(0.0, min(100.0, vector_score * 100))

    return {
        "overall_similarity": round(overall_percent, 2),
        "vector_similarity": round(vector_percent, 2),
        "similarity_label": get_similarity_label(overall_percent),
        "feature_similarities": {
            "timbre_mfcc": feature_scores["mfcc"],
            "harmony_chroma": feature_scores["chroma"],
            "brightness_spectral_centroid": feature_scores["spectral_centroid"],
            "tempo": feature_scores["tempo"]
        },
        "method": "Cosine similarity over MFCC, chroma, spectral centroid, and tempo feature vectors",
        "note": "This is a lightweight feature-based MIR similarity baseline. It does not yet model temporal structure or learned semantic embeddings."
    }