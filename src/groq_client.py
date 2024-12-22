from groq import Groq
import streamlit as st
from .config import Config
import time
from typing import List, Dict, Any, Optional

class GroqHandler:
    def __init__(self):
        """Initialize Groq client with configuration settings."""
        self.client = Groq(api_key=Config.GROQ_API_KEY)
        # Increased chunk size since we want more detailed content
        self.CHUNK_SIZE = 6000      # Characters per chunk
        self.OVERLAP_SIZE = 200     # Increased overlap for better context
        self.RATE_LIMIT_DELAY = 2   
        self.MAX_RETRIES = 3        

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

    def process_chunk_with_retry(self, chunk: str, system_prompt: str, retry_count: int = 0) -> Optional[Dict[str, Any]]:
        """Process a single chunk with retry mechanism."""
        try:
            response = self.client.chat.completions.create(
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
                max_tokens=4096,  # Increased for more detailed responses
                top_p=1,
                stream=False
            )
            return response

        except Exception as e:
            if retry_count < self.MAX_RETRIES:
                wait_time = self.RATE_LIMIT_DELAY * (2 ** retry_count)
                st.warning(f"Processing error. Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
                return self.process_chunk_with_retry(chunk, system_prompt, retry_count + 1)
            else:
                st.error(f"Failed to process content after {self.MAX_RETRIES} retries: {str(e)}")
                return None

    def generate_educational_notes(self, transcript_text: str) -> Optional[str]:
        """Generate detailed educational notes from transcript."""
        try:
            if len(transcript_text) > self.CHUNK_SIZE:
                st.info("This appears to be a longer lecture. Processing in sections...")
                return self.process_long_content(transcript_text)
            
            prompt = self.create_educational_prompt(transcript_text)
            response = self.process_chunk_with_retry(
                prompt,
                "You are an expert educational content creator, skilled at breaking down complex topics into clear, organized notes for students."
            )
            
            if response and response.choices:
                return response.choices[0].message.content
            return None

        except Exception as e:
            st.error(f"Error processing educational content: {str(e)}")
            return None

    def process_long_content(self, transcript_text: str) -> Optional[str]:
        """Process longer lectures by sections while maintaining educational context."""
        chunks = self.split_text_into_chunks(transcript_text)
        st.info(f"Processing lecture in {len(chunks)} sections to maintain detail and clarity...")
        
        # Process each chunk as a standalone section
        section_notes = []
        for i, chunk in enumerate(chunks, 1):
            st.write(f"Processing section {i} of {len(chunks)}...")
            
            if i > 1:
                time.sleep(self.RATE_LIMIT_DELAY)
            
            section_prompt = self.create_educational_prompt(
                chunk, 
                section_number=i, 
                total_sections=len(chunks)
            )
            
            response = self.process_chunk_with_retry(
                section_prompt,
                "You are an expert educational content creator, skilled at breaking down complex topics into clear, organized notes for students."
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

Lecture Content:
{text}

Please maintain academic language while ensuring the notes are clear and accessible to students. Include any diagrams or visual concepts described in words."""

    def __init_subclass__(self) -> None:
        """Remove the redundant summary combination step."""
        pass  # We don't need to combine summaries anymore since we're keeping detailed section notes


