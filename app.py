import streamlit as st
from src.config import Config
from src.groq_client import GroqHandler
from src.youtube import YouTubeHandler
from src.note_manager import NoteManager
from src.ui_components import UIComponents

def main():
    """Main application function"""
    # Set up page configuration
    st.set_page_config(layout="wide", page_title="YouTube Note-Taking App")
    
    # Initialize session state
    UIComponents.initialize_session_state()
    
    # Apply custom CSS
    st.markdown(Config.CUSTOM_CSS, unsafe_allow_html=True)
    
    # Initialize handlers
    youtube_handler = YouTubeHandler()
    groq_handler = GroqHandler()
    
    # Create two columns for the layout
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.title("YouTube Video Notes") 
        # YouTube URL input with placeholder
        youtube_url = st.text_input(
            "Enter YouTube URL",
            placeholder="https://www.youtube.com/watch?v=..."
        )
        
        if youtube_url:
            video_id = youtube_handler.extract_video_id(youtube_url)
            if video_id:
                st.session_state.video_id = video_id
                # Embed YouTube video
                st.markdown(
                    youtube_handler.create_embed_html(video_id),
                    unsafe_allow_html=True
                )
                
                # Generate summary button with loading state
                if st.button("Generate Summary"):
                    with st.spinner("Generating summary..."):
                        transcript_text, detailed_transcript = youtube_handler.get_transcript(video_id)
                        if transcript_text:
                            summary = groq_handler.generate_educational_notes(transcript_text)
                            if summary:
                                st.session_state.summary = summary
                                st.session_state.timestamps = [
                                    {'time': entry['start'], 
                                     'text': entry['text']}
                                    for entry in detailed_transcript
                                ]
        
        # Display timestamps
        UIComponents.display_timestamps()
    
    with col2:
        st.title("Notes")
        # Display AI-generated summary
        UIComponents.display_summary()
        
        # Display notes editor
        UIComponents.display_notes_editor()
        
        # Save and load buttons in columns
        col_save, col_load = st.columns(2)
        with col_save:
            if st.button("Save Notes", key="save"):
                NoteManager.save_notes()
        with col_load:
            if st.button("Load Notes", key="load"):
                NoteManager.load_notes()

if __name__ == "__main__":
    main()