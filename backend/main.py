# main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import analyzer  
from services.music_similarity import compare_audio_files as calculate_similarity
import os
import tempfile

app = FastAPI(title="MIRa Core API", description="A simple API for Music Information Retrieval Analysis.")

# Add CORS middleware 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Endpoint to compare two audio files
@app.post("/compare-audio")
async def compare_audio_files(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    """
    Endpoint to compare two audio files and return a similarity score.
    """
    print(f"Received files: {file1.filename}, {file2.filename}")

    # Validate file types
    if not file1.content_type.startswith('audio/') or not file2.content_type.startswith('audio/'):
        return JSONResponse(
            status_code=400,
            content={"error": "Please upload valid audio files (e.g., MP3, WAV)"}
        )

    try:
        # Create temporary files for both uploads
        suffix1 = os.path.splitext(file1.filename)[1]
        suffix2 = os.path.splitext(file2.filename)[1]
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix1) as tmp1, \
             tempfile.NamedTemporaryFile(delete=False, suffix=suffix2) as tmp2:
            content1 = await file1.read()
            content2 = await file2.read()
            tmp1.write(content1)
            tmp2.write(content2)
            tmp_file_path1 = tmp1.name
            tmp_file_path2 = tmp2.name

        # Calculate similarity score
        similarity_score = calculate_similarity(tmp_file_path1, tmp_file_path2)

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Comparison failed: {str(e)}"})
    finally:
        # Clean up temporary files
        if 'tmp_file_path1' in locals():
            os.unlink(tmp_file_path1)
        if 'tmp_file_path2' in locals():
            os.unlink(tmp_file_path2)

    return {"similarity_score": similarity_score}


# Endpoint to analyze a single audio file
@app.post("/analyze")
async def analyze_music_file(file: UploadFile = File(...)):
    """
    Endpoint that accepts an audio file upload and returns its analysis.
    """
    print(f"Received file: {file.filename}")

    # Validate file type
    if not file.content_type.startswith('audio/'):
        return JSONResponse(
            status_code=400,
            content={"error": "Please upload an audio file (e.g., MP3, WAV)"}
        )

    # Create a temporary file
    try:
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_file_path = tmp.name

        # Analyze the file
        analysis_results = analyzer.analyze_audio(tmp_file_path)

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Analysis failed: {str(e)}"})
    finally:
        # Clean up temporary file
        if 'tmp_file_path' in locals():
            os.unlink(tmp_file_path)

    return analysis_results

# health check endpoint
@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "Welcome to the Music Analysis API. Use POST /analyze to analyze audio files. Use /docs for API documentation."}