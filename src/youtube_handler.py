import re
from youtube_transcript_api import YouTubeTranscriptApi
from yt_dlp import YoutubeDL
import os
import tempfile
from groq import Groq
from pathlib import Path
from pydub import AudioSegment
import math
import time
from .logger import get_logger

logger = get_logger()

class YouTubeHandler:
    def __init__(self):
        """Initialize the YouTube handler with necessary configurations."""

        # Create temporary directory for processing files
        self.temp_dir = tempfile.mkdtemp()

        # Initialize Groq client with API key
        self.groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))

        # Set chunk duration to 2 minutes to stay within token limits
        self.mins = 15
        self.MAX_CHUNK_DURATION = self.mins * 60 * 1000  

        # Configure rate limiting
        self.RATE_LIMIT_DELAY = 1
        self.MAX_RETRIES = 2   

    def extract_video_id(self, url):
        """Extract YouTube video ID from various URL formats."""
        if not url:
            return None
            
        # Handle different YouTube URL patterns including shorts
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
            r'youtube\.com\/watch\?.+&v=([a-zA-Z0-9_-]{11})',
            r'youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None

    def download_audio(self, video_id):
        """Download audio from YouTube video in mp3 format."""
        try:
            output_path = Path(self.temp_dir) / f"{video_id}_audio"
            
            # Configure download options for best audio quality
            ydl_opts = {
                'format': 'bestaudio/best',
                'outtmpl': str(output_path),
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
                'quiet': True,
                'no_warnings': True
            }

            # Download the audio
            with YoutubeDL(ydl_opts) as ydl:
                url = f"https://www.youtube.com/watch?v={video_id}"
                ydl.download([url])

            return str(output_path) + '.mp3'

        except Exception as e:
            return None

    def split_audio_into_chunks(self, audio_path):
        """Split audio file into manageable chunks for processing."""
        try:
            # Load and process the audio file
            audio = AudioSegment.from_mp3(audio_path)
            total_duration = len(audio)
            num_chunks = math.ceil(total_duration / self.MAX_CHUNK_DURATION)
            
            # Display processing information
            logger.info(f"Total audio duration: {total_duration/1000/60:.2f} minutes")
            logger.info(f"Processing in {num_chunks} chunks ({self.mins} minutes each)")
            
            chunk_paths = []
            for i in range(num_chunks):
                start_time = i * self.MAX_CHUNK_DURATION
                end_time = min((i + 1) * self.MAX_CHUNK_DURATION, total_duration)
                
                # Extract and optimize the chunk
                chunk = audio[start_time:end_time]
                chunk = chunk.normalize()  # Normalize audio levels
                
                # Save chunk with optimized settings
                chunk_path = Path(self.temp_dir) / f"chunk_{i}.mp3"
                chunk.export(
                    str(chunk_path),
                    format="mp3",
                    parameters=[
                        "-q:a", "0",  # High quality VBR
                        "-b:a", "64k", # Reduced bitrate
                        "-ac", "1"     # Mono audio
                    ]
                )
                chunk_paths.append(str(chunk_path))
                
                # Display chunk information
                file_size = os.path.getsize(chunk_path)
                logger.info(f"Chunk {i+1} size: {file_size/1024/1024:.2f} MB")

            return chunk_paths

        except Exception as e:
            logger.error(f"Error splitting audio: {str(e)}")
            return None

    def transcribe_audio_chunk(self, chunk_path, chunk_index, total_chunks):
        """Transcribe a single audio chunk with retry mechanism."""
        for retry in range(self.MAX_RETRIES):
            try:
                # Verify file exists and check size
                if not os.path.exists(chunk_path):
                    raise FileNotFoundError(f"Chunk file not found: {chunk_path}")
                
                file_size = os.path.getsize(chunk_path)
                if file_size > 25 * 1024 * 1024:  # 25MB limit
                    raise ValueError(f"Chunk file too large ({file_size/1024/1024:.2f} MB)")
                
                # Process the chunk
                with open(chunk_path, "rb") as file:
                    transcription = self.groq_client.audio.transcriptions.create(
                        file=file,
                        model="whisper-large-v3",
                        response_format="verbose_json",
                    )
                    
                    chunk_text = transcription.text if hasattr(transcription, 'text') else ""
                    start_time = chunk_index * (self.MAX_CHUNK_DURATION / 1000)

                    return {
                        'text': chunk_text,
                        'start': start_time,
                        'chunk_index': chunk_index,
                        'total_chunks': total_chunks
                    }

            except Exception as e:
                error_message = str(e)
                if 'rate_limit_exceeded' in error_message:
                    if retry < self.MAX_RETRIES - 1:
                        wait_time = self.RATE_LIMIT_DELAY * (retry + 1)
                        logger.warning(f"Rate limit reached. Waiting {wait_time} seconds...")
                        time.sleep(wait_time)
                        continue
                logger.error(f"Error processing chunk {chunk_index + 1}: {error_message}")
                return None

    def merge_transcriptions(self, chunk_transcriptions):
        """Merge processed chunks into a complete transcript."""
        if not chunk_transcriptions:
            return None, None

        # Filter and sort valid chunks
        valid_chunks = [chunk for chunk in chunk_transcriptions if chunk is not None]
        sorted_chunks = sorted(valid_chunks, key=lambda x: x['chunk_index'])
        
        if not sorted_chunks:
            return None, None

        # Process and clean up text
        processed_chunks = []
        for chunk in sorted_chunks:
            text = chunk['text'].strip()
            if text and text[-1] not in '.!?':
                text += '.'
            processed_chunks.append(text)

        # Create final transcript
        full_text = ' '.join(processed_chunks)
        detailed_transcript = [
            {
                'start': chunk['start'],
                'text': chunk['text'].strip()
            }
            for chunk in sorted_chunks
        ]

        return full_text, detailed_transcript

    def get_transcript(self, video_id):
        """Get transcript from YouTube API or generate it using Whisper."""
        try:
            # Try getting official transcript first
            logger.info("Attempting to fetch official transcript...")
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            full_text = ' '.join([entry['text'] for entry in transcript])
            return full_text, transcript
        except Exception:
            logger.info("Generating transcript from audio...")
            return self.generate_transcript_from_audio(video_id)

    def generate_transcript_from_audio(self, video_id):
        """Generate transcript for videos without official transcripts."""
        try:
            audio_path = self.download_audio(video_id)
            if not audio_path:
                raise Exception("Failed to download audio")

            chunk_paths = self.split_audio_into_chunks(audio_path)
            if not chunk_paths:
                raise Exception("Failed to split audio into chunks")

            # Process chunks with progress tracking
            chunk_transcriptions = []
            total_chunks = len(chunk_paths)

            for i, chunk_path in enumerate(chunk_paths):
                if i > 0:
                    logger.info(f"Waiting {self.RATE_LIMIT_DELAY} seconds...")
                    time.sleep(self.RATE_LIMIT_DELAY)
                    
                    transcription = self.transcribe_audio_chunk(chunk_path, i, total_chunks)

                    if transcription:
                        chunk_transcriptions.append(transcription)

            if chunk_transcriptions:
                return self.merge_transcriptions(chunk_transcriptions)
            else:
                raise Exception("Failed to transcribe audio chunks")

        except Exception as e:
            logger.error(f"Error generating transcript: {str(e)}")
            return None, None
        finally:
            self.cleanup_temp_files()

    def cleanup_temp_files(self):
        """Clean up temporary files after processing."""
        try:
            for file in Path(self.temp_dir).glob("*"):
                file.unlink()
        except Exception as e:
            logger.warning(f"Error cleaning up temporary files: {str(e)}")

    # def create_embed_html(self, video_id):
    #     """Create HTML for embedding YouTube video."""
    #     return f'''
    #         <iframe 
    #             width="100%" 
    #             height="400" 
    #             src="https://www.youtube.com/embed/{video_id}" 
    #             frameborder="0" 
    #             allowfullscreen>
    #         </iframe>
    #     '''

    def __del__(self):
        """Cleanup resources when the object is destroyed."""
        try:
            for file in Path(self.temp_dir).glob("*"):
                file.unlink()
            Path(self.temp_dir).rmdir()
        except Exception:
            pass