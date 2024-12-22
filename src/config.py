import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration class to hold all settings
class Config:
    # API Keys
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    
    # Model Settings
    GROQ_MODEL = "llama-3.3-70b-versatile"
    
    # File Storage
    NOTES_DIRECTORY = "saved_notes"
    
    # Ensure the notes directory exists
    os.makedirs(NOTES_DIRECTORY, exist_ok=True)
    
    # Custom CSS for the application
    CUSTOM_CSS = """
        <style>
        .stTextArea textarea {
            border: none;
            background-color: #f8f9fa;
            font-size: 16px;
            font-family: 'Arial', sans-serif;
            padding: 15px;
            border-radius: 5px;
        }
        .stTextArea textarea:focus {
            box-shadow: none;
            border: none;
        }
        .main .block-container {
            padding-top: 2rem;
            padding-bottom: 2rem;
        }
        </style>
    """