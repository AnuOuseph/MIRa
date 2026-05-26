# main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile, Form, Response, HTTPException
from fastapi.responses import JSONResponse
import analyzer  
from services.music_similarity import compare_audio_files as calculate_similarity
from services.dsp.audio_io import decode_audio
from services.dsp.hrtf import make_hrtf
from services.dsp.hrtf_kemar import load_kemar
from services.dsp.convolver import apply_binaural, encode_wav

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

# endpoint to spatialize audio 
@app.post("/spatialize")
async def spatialize(
    audio: UploadFile = File(...),
    azimuth: float = Form(...),
    elevation: float = Form(0.0),
    dataset:   str        = Form("synthetic"),
):
    try:
        if not audio.content_type or not audio.content_type.startswith("audio/"):
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "error": "Invalid file type. Please upload an audio file."
                }
            )

        if not (-180 <= azimuth <= 360):
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "error": "Azimuth must be between -180 and 360 degrees."
                }
            )

        if not (-40 <= elevation <= 90):
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "error": "Elevation must be between -40 and 90 degrees."
                }
            )

        raw = await audio.read()

        if not raw:
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "error": "Uploaded audio file is empty."
                }
            )

        mono = decode_audio(raw)
        if dataset == "mit-kemar":
            print(f"kemar dataset selected, loading HRTF for azimuth={azimuth}, elevation={elevation}")
            hrtf_l, hrtf_r = load_kemar(azimuth, elevation)
        else:
            hrtf_l, hrtf_r = make_hrtf(azimuth, elevation)
        stereo = apply_binaural(mono, hrtf_l, hrtf_r)
        wav = encode_wav(stereo)

        return Response(
            content=wav,
            media_type="audio/wav",
            headers={
                "Content-Disposition": 'attachment; filename="spatialized.wav"'
            }
        )

    except HTTPException:
        raise

    except Exception as e:
        print("Spatialize error:")
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": "Failed to spatialize audio.",
                "message": str(e)
            }
        )

# health check endpoint
@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "Welcome to the Music Analysis API. Use POST /analyze to analyze audio files. Use /docs for API documentation."}