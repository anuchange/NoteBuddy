from .youtube_handler import YouTubeHandler
from .groq_client import GroqHandler
from .html_convertor import convert_markdown_to_html
from fastapi.responses import HTMLResponse

# Initialize YouTube handler
youtube_handler = YouTubeHandler()
groq_handler = GroqHandler()

import logging
from .logger import setup_logger

# Configure once at application startup
logger = setup_logger(
    name="NoteBuddy",
    log_level=logging.DEBUG
)


def generate_notes(youtube_url: str, groq_api=None):
    
    """Generate notes for a YouTube video"""
    logger.info('Groq API: {}'.format(groq_api))
    video_id = youtube_handler.extract_video_id(youtube_url)
    summary = ""
    if video_id:

        transcript_text, detailed_transcript = youtube_handler.get_transcript(video_id, groq_api=groq_api)
        if transcript_text:
            summary = groq_handler.generate_educational_notes(transcript_text, groq_api=groq_api)

    # Convert to HTML with monokai style (dark theme for better visibility)
    html_output = convert_markdown_to_html(summary, code_style='monokai')
    response = HTMLResponse(content=html_output)
    return response

def chat_response_generation(message: str, encoded_image: str, groq_api=None):

    # Stream the response
    full_response = ""
    for response_chunk in groq_handler.process_streamed_chat(message, encoded_image, groq_api=groq_api):
        full_response += response_chunk

    # Convert to HTML with monokai style (dark theme for better visibility)
    html_output = convert_markdown_to_html(full_response, code_style='monokai')
    response = HTMLResponse(content=html_output)
    # print(response.body.decode())
    return response