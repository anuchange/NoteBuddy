from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from src.response_generation import generate_notes, chat_response_generation
from typing import Optional
import logging
from src.logger import setup_logger
# from src.cookies_getter import save_youtube_cookies

# Configure once at application startup
logger = setup_logger(
    name="NoteBuddy",
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
    groq_api: Optional[str] = None

class ChatbotRequest(BaseModel):
    query: str
    image: Optional[str] = None
    groq_api: Optional[str] = None

# Response models
class NotesResponse(BaseModel):
    notes: str

class ChatbotResponse(BaseModel):
    response: str
    
@app.get("/api/userlogin")
def user_login():
    # Get youtube cookies for the session
    logger.info("Generating cookies.....")
    # save_youtube_cookies()
    logger.info("Saved cookies")
    return "Login successful!"

@app.post("/api/ping")
async def ping():
   try:
       return {"status": "success", "message": "System is up"}
   except Exception as e:
       raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/notes", response_model=NotesResponse)
async def create_notes(request: NotesRequest):
    try:

        # Call the generate_notes function from response_generation.py
        logger.info(f"Generating notes for videoId: {request.videoId}")
        response = generate_notes(request.videoId, request.groq_api)
        logger.info(f"Generated notes response: {response}")
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chatbot", response_model=ChatbotResponse)
async def chat_response(request: ChatbotRequest):
    try:
        # Call the chat response generation function
        # You'll need to import this function from your module
        response = chat_response_generation(request.query, request.image, request.groq_api)
        logger.info(f"Generated chatbot response chatbot: {response}")
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)