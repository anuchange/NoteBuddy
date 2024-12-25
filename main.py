from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from src.response_generation import generate_notes, chat_response_generation
from typing import Optional
import logging
from src.logger import setup_logger

# Configure once at application startup
logger = setup_logger(
    name="NoteBuddy",
    log_file="./logs/app.log",
    log_level=logging.DEBUG
)


app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class NotesRequest(BaseModel):
    videoId: str

class ChatbotRequest(BaseModel):
    query: str
    image: Optional[str] = None

# Response models
class NotesResponse(BaseModel):
    notes: str

class ChatbotResponse(BaseModel):
    response: str

@app.post("/api/notes", response_model=NotesResponse)
async def create_notes(request: NotesRequest):
    try:
        # Call the generate_notes function from response_generation.py
        logger.info(f"Generating notes for videoId: {request.videoId}")
        response = generate_notes(request.videoId)
        logger.info(f"Generated notes response: {response}")
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chatbot", response_model=ChatbotResponse)
async def chat_response(request: ChatbotRequest):
    try:
        # Call the chat response generation function
        # You'll need to import this function from your module
        response = chat_response_generation(request.query, request.image)
        logger.info(f"Generated chatbot response chatbot: {response}")
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)