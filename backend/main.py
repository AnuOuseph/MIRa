# main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import analyzer  
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

@app.get("/")
async def root():
    return {"message": "Welcome to the Music Analysis API. Use POST /analyze to analyze audio files."}