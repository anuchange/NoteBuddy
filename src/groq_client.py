from groq import Groq
from .config import Config
import time
from .logger import get_logger
from typing import List, Dict, Any, Optional

logger = get_logger()

class GroqHandler:
    def __init__(self, groq_api=None):
        """Initialize Groq client with configuration settings."""

        self.CHUNK_SIZE = 6000      # Characters per chunk
        self.OVERLAP_SIZE = 200     # Increased overlap for better context
        self.RATE_LIMIT_DELAY = 1   
        self.MAX_RETRIES = 2        

    def split_text_into_chunks(self, text: str) -> List[str]:
        """Split text into manageable chunks while preserving context."""
        chunks = []
        text_length = len(text)
        start = 0
        
        while start < text_length:
            end = start + self.CHUNK_SIZE
            
            if end >= text_length:
                chunks.append(text[start:])
                break
                
            # Try to find sentence endings for more natural breaks
            search_start = max(start, end - self.OVERLAP_SIZE)
            break_point = end
            
            # Look for sentence endings (., !, ?)
            for punct in ['. ', '! ', '? ']:
                last_sent = text.rfind(punct, search_start, end)
                if last_sent != -1:
                    break_point = last_sent + 1
                    break
            
            if break_point == end:
                # Fallback to line breaks or spaces
                last_newline = text.rfind('\n', search_start, end)
                if last_newline != -1:
                    break_point = last_newline
                else:
                    last_space = text.rfind(' ', search_start, end)
                    if last_space != -1:
                        break_point = last_space
            
            chunks.append(text[start:break_point])
            start = break_point

        return chunks

    def process_chunk_with_retry(self, chunk: str, system_prompt: str, client: str, retry_count: int = 0) -> Optional[Dict[str, Any]]:
        """Process a single chunk with retry mechanism."""
        try:
            response = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": chunk
                    }
                ],
                model=Config.GROQ_MODEL,
                temperature=0.7,
                max_tokens=self.CHUNK_SIZE,  
                top_p=1,
                stream=False
            )
            return response

        except Exception as e:
            if retry_count < self.MAX_RETRIES:
                wait_time = self.RATE_LIMIT_DELAY * (2 ** retry_count)
                logger.warning(f"Processing error. Retrying in {wait_time} seconds..., Retry Count: {retry_count}")
                time.sleep(wait_time)
                return self.process_chunk_with_retry(chunk=chunk, system_prompt=system_prompt, client=client, retry_count=retry_count + 1)
            else:
                logger.error(f"Failed to process content after {self.MAX_RETRIES} retries: {str(e)}")
                return None

    def generate_educational_notes(self, transcript_text: str, groq_api=None) -> Optional[str]:

        """Generate detailed educational notes from transcript."""
        logger.info("Groq API Key: {}".format(groq_api))
        if groq_api:
            client = Groq(api_key=groq_api)
        else:
            client = Groq(api_key=Config.GROQ_API_KEY)
        try:
            if len(transcript_text) > self.CHUNK_SIZE:
                logger.info("This appears to be a longer lecture. Processing in sections...")
                return self.process_long_content(transcript_text, client)
            
            prompt = self.create_educational_prompt(transcript_text)
            response = self.process_chunk_with_retry(
                chunk=prompt,
                system_prompt="You are an expert educational content creator, skilled at breaking down complex topics into clear, organized notes for students.",
                client=client
            )
            
            if response and response.choices:
                return response.choices[0].message.content
            return None

        except Exception as e:
            logger.error(f"Error processing educational content: {str(e)}")
            return None

    def process_long_content(self, transcript_text: str, client) -> Optional[str]:
        """Process longer lectures by sections while maintaining educational context."""
        chunks = self.split_text_into_chunks(transcript_text)
        logger.info(f"Processing lecture in {len(chunks)} sections to maintain detail and clarity...")
        
        # Process each chunk as a standalone section
        section_notes = []
        for i, chunk in enumerate(chunks, 1):
            logger.info(f"Processing section {i} of {len(chunks)}...")
            
            if i > 1:
                time.sleep(self.RATE_LIMIT_DELAY)
            
            section_prompt = self.create_educational_prompt(
                chunk, 
                section_number=i, 
                total_sections=len(chunks)
            )
            
            response = self.process_chunk_with_retry(
                chunk=section_prompt,
                system_prompt="You are an expert educational content creator, skilled at breaking down complex topics into clear, organized notes for students.",
                client=client
            )
            
            if response and response.choices:
                section_notes.append(response.choices[0].message.content)
        
        # Combine sections with clear separation
        if section_notes:
            return "\n\n".join([
                f"Section {i+1} Notes:\n{notes}" 
                for i, notes in enumerate(section_notes)
            ])
        return None

    def create_educational_prompt(self, text: str, section_number: int = None, total_sections: int = None) -> str:
        """Create a detailed prompt for educational content processing."""
        context = ""
        if section_number and total_sections:
            context = f"\nThis is section {section_number} of {total_sections} from the lecture."

        return f"""Please create detailed educational notes from this lecture transcript{context}. Focus on:

1. Key Concepts and Definitions
   - Identify and explain important terms and concepts
   - Highlight fundamental principles discussed

2. Main Ideas and Supporting Details
   - Break down complex topics into clear explanations
   - Include relevant examples or analogies used

3. Important Relationships and Connections
   - Show how different concepts relate to each other
   - Identify cause-and-effect relationships

4. Practical Applications
   - Note any real-world applications mentioned
   - Include practice problems or exercises if mentioned

5. Additional Resources
   - Note any recommended readings or materials mentioned
   - Include references to related topics for further study

Format the notes in a clear, hierarchical structure using markdown formatting. Include bullet points and sub-points where appropriate. If specific formulas, equations, or technical details are mentioned, include them with proper formatting.

Headings should be content-specific, not necessarily matching the lecture structure. Use clear, concise language to explain complex topics effectively.

Lecture Content:
{text}

Please maintain academic language while ensuring the notes are clear and accessible to students. Include any diagrams or visual concepts described in words."""

    def __init_subclass__(self) -> None:
        """Remove the redundant summary combination step."""
        pass  # We don't need to combine summaries anymore since we're keeping detailed section notes

    # def chat_completion(self, message: str, image=None) -> str:
    #         """
    #         Get chat completion from Groq
    #         Args:
    #             message: User's text message
    #             image: Optional PIL Image object
    #         Returns:
    #             str: Assistant's response
    #         """
    #         try:
    #             # Prepare messages
    #             messages = [
    #                 {
    #                     "role": "system",
    #                     "content": self._get_chat_system_prompt()
    #                 }
    #             ]
                
    #             # If there's an image, format message with image
    #             if image:
    #                 messages.append({
    #                     "role": "user",
    #                     "content": [
    #                         {
    #                             "type": "image",
    #                             "source": {
    #                                 "type": "image",
    #                                 "data": image
    #                             }
    #                         },
    #                         {
    #                             "type": "text",
    #                             "text": message
    #                         }
    #                     ]
    #                 })
    #             else:
    #                 messages.append({
    #                     "role": "user",
    #                     "content": message
    #                 })

    #             # Get completion from Groq
    #             response = self.client.chat.completions.create(
    #                 messages=messages,
    #                 model=Config.GROQ_VISION_MODEL,
    #                 temperature=0.7,
    #                 max_tokens=2048,
    #                 stream=False
    #             )

    #             if response and response.choices:
    #                 return response.choices[0].message.content
    #             return "I apologize, but I couldn't process your message."

    #         except Exception as e:
    #             logger.error(f"Error in chat completion: {str(e)}")
    #             return "An error occurred while processing your message."

    def _get_chat_system_prompt(self) -> str:
        """Get system prompt for chat"""
        return """You are a helpful AI assistant integrated with a note-taking application. 
You can:
- Help users with note-taking and summarization
- Analyze images and screenshots they share
- Provide clear explanations and clarifications
- Help organize and structure information

When working with images:
- Describe what you see in detail
- Identify any text or important information
- Relate the image content to the discussion context
- Provide relevant suggestions or insights

Keep responses concise yet informative, and maintain context of the conversation."""

    # def encode_image(self, image):
    #     """
    #     Encode PIL Image to base64 data URL
    #     Args:
    #         image: PIL Image object
    #     Returns:
    #         str: base64 data URL
    #     """
    #     try:
    #         # Convert PIL Image to bytes
    #         buffered = io.BytesIO()
    #         image.save(buffered, format="JPEG")
    #         img_str = base64.b64encode(buffered.getvalue()).decode()
    #         return f"data:image/jpeg;base64,{img_str}"
    #     except Exception as e:
    #         logger.error(f"Error encoding image: {str(e)}")
    #         return None

    def process_streamed_chat(self, message: str, encoded_image=None, groq_api=None):
            """
            Process chat message with streaming response
            Args:
                message: User's text message
                image: Optional PIL Image
            Yields:
                str: Response chunks
            """

            if groq_api:
                client = Groq(api_key=groq_api)
            else:
                client = Groq(api_key=Config.GROQ_API_KEY)
                
            try:
                if encoded_image:
                    # For vision model: no system message, only user message with image
                    image_url = encoded_image
                    if image_url:
                        messages = [
                            {
                                "role": "user",
                                "content": [
                                    {"type": "text", "text": message},
                                    {
                                        "type": "image_url",
                                        "image_url": {
                                            "url": image_url
                                        }
                                    }
                                ]
                            }
                        ]
                        model = Config.GROQ_VISION_MODEL
                    else:
                        # Fallback to text-only if image encoding fails
                        messages = [
                            {
                                "role": "system",
                                "content": "You are a helpful AI assistant."
                            },
                            {
                                "role": "user",
                                "content": f"[Image processing failed] {message}"
                            }
                        ]
                        model = Config.GROQ_MODEL
                else:
                    # Text-only message with system context
                    messages = [
                        {
                            "role": "system",
                            "content": "You are a helpful AI assistant."
                        },
                        {
                            "role": "user",
                            "content": message
                        }
                    ]
                    model = Config.GROQ_MODEL

                response = client.chat.completions.create(
                    messages=messages,
                    model=model,
                    temperature=0.7,
                    max_tokens=3000,
                    stream=True
                )
                
                for chunk in response:
                    if chunk.choices and chunk.choices[0].delta.content:
                        yield chunk.choices[0].delta.content
                        
            except Exception as e:
                error_msg = f"""
                Error in chat processing:
                Type: {type(e)}
                Message: {str(e)}
                """
                logger.error(error_msg)
                yield "I apologize, but I encountered an error processing your message. Please check the error details above."