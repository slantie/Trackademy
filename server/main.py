import sys
import httpx
import signal
import tempfile, os
import pandas as pd
from typing import Dict
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from matrix_helper_functions import run_matrix_pipeline
from result_helper_functions import process_result_dataframe
from fastapi import FastAPI, File, UploadFile, Form, status, HTTPException, Header, Depends

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
# Dynamically get backend URL from environment variable, default to localhost for development
backend_url = os.getenv("BACKEND_URL") 

SERVICE_API_KEY = os.getenv("SERVICE_API_KEY")

# Graceful shutdown handling
def signal_handler(signum, frame):
    """Handle CTRL+C and other termination signals gracefully."""
    print(f"\n🛑 Received signal {signum}. Initiating graceful shutdown...")
    print("👋 FastAPI server shutting down gracefully.")
    sys.exit(0)

# Register signal handlers for graceful shutdown
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles startup and shutdown events for the FastAPI application.
    Fetches necessary data on startup using service-to-service authentication.
    """
    try:
        # Validate that the SERVICE_API_KEY is configured
        if not SERVICE_API_KEY:
            raise ValueError("SERVICE_API_KEY environment variable is not set")
                
    except httpx.HTTPStatusError as e:
        print(f"❌ HTTP Error during startup data fetch: {e}")
        print(f"Request URL: {e.request.url}")
        print(f"Response Status: {e.response.status_code}")
        print(f"Response Body: {e.response.text}")
        raise RuntimeError(f"Failed to fetch essential startup data: {e.response.text}") from e
    except Exception as e:
        print(f"❌ An unexpected error occurred during startup data fetch: {e}")
        raise RuntimeError(f"Failed to fetch essential startup data: {e}") from e
    yield
    # Clean up on shutdown if necessary
    print("👋 Graceful Exit")

# Initialize FastAPI app with the lifespan manager
app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to check for API Key
async def verify_api_key(service_api_key: str = Header(...)):
    """
    Verifies the API key provided in the Service-API-Key header.
    """
    if not SERVICE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Service API Key is not configured on the server."
        )
    if service_api_key != SERVICE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key"
        )
    return True

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "message": "FastAPI Server is Live!",
        "service": "Trackademy Processing Service",
        "version": "1.0.0"
    }

@app.post("/api/v1/results", response_model=Dict, status_code=status.HTTP_200_OK)
async def process_results(
    api_key_check: bool = Depends(verify_api_key),
    result: UploadFile = File(...),
):
    if not api_key_check:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Service API Key"
        )

    temp_file_path = None
    try:
        if not result.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")

        suffix = os.path.splitext(result.filename)[-1].lower()
        if suffix not in ['.xlsx', '.xls']:
            raise HTTPException(status_code=400, detail="Only Excel files are supported")

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            content = await result.read()
            if not content:
                raise HTTPException(status_code=400, detail="Uploaded file is empty")
            temp_file.write(content)
            temp_file_path = temp_file.name

        try:
            df = pd.read_excel(temp_file_path)
            results = process_result_dataframe(df)
        except Exception as e:
            print(f"❌ Error during result processing: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to process the result file: {str(e)}")

        if not results:
            raise HTTPException(status_code=404, detail="No valid data found in the result sheet.")

        return JSONResponse(content={"status": "success", "data": results})

    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
                print(f"🗑️ Deleted temporary file: {temp_file_path}")
            except Exception as e:
                print(f"⚠️ Warning: Failed to delete temp file {temp_file_path}: {str(e)}")
                
@app.post("/api/v1/faculty-matrix", response_model=Dict, status_code=status.HTTP_200_OK)
async def faculty_matrix(
    api_key_check: bool = Depends(verify_api_key),
    facultyMatrix: UploadFile = File(...),
    deptAbbreviation: str = Form(...),
    collegeAbbreviation: str = Form(...)
):
    if not api_key_check:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Service API Key"
        )
    
    temp_file_path = None
    try:
        # Validate file type
        if not facultyMatrix.filename:
            raise HTTPException(
                status_code=400, 
                detail="No file uploaded"
            )
        
        # Check file extension
        suffix = os.path.splitext(facultyMatrix.filename)[-1].lower()
        if suffix not in ['.xlsx', '.xls']:
            raise HTTPException(
                status_code=400, 
                detail="Invalid file type. Only Excel files (.xlsx, .xls) are supported"
            )
        
        # Validate department abbreviation
        if not deptAbbreviation or not deptAbbreviation.strip():
            raise HTTPException(
                status_code=400, 
                detail="Department abbreviation is required"
            )
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            try:
                content = await facultyMatrix.read()
                if not content:
                    raise HTTPException(
                        status_code=400, 
                        detail="Uploaded file is empty"
                    )
                temp_file.write(content)
                temp_file_path = temp_file.name
            except Exception as e:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Error reading uploaded file: {str(e)}"
                )

        # Process the matrix
        try:
            results = run_matrix_pipeline(
                matrix_file_path=temp_file_path,
                department=deptAbbreviation.strip(),
                college=collegeAbbreviation.strip()
            )
        except Exception as e:
            print(f"❌ Matrix processing error: {str(e)}")
            raise HTTPException(
                status_code=500, 
                detail=f"Error processing timetable matrix: {str(e)}"
            )

        if not results:
            print("❌ No results found in the processed matrix")
            raise HTTPException(
                status_code=404, 
                detail="No timetable data found in the uploaded matrix. Please check the file format and content."
            )

        print(f"✅ Successfully processed matrix for department: {deptAbbreviation}")
        return JSONResponse(content=results)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Unexpected error in faculty_matrix endpoint: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"An unexpected error occurred: {str(e)}"
        )
    finally:
        # Cleanup temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
                print(f"🗑️ Cleaned up temporary file: {temp_file_path}")
            except Exception as e:
                print(f"⚠️ Warning: Could not delete temporary file {temp_file_path}: {str(e)}")