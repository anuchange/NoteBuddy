import os
import json
from datetime import datetime
import streamlit as st
from .config import Config

class NoteManager:
    @staticmethod
    def save_notes():
        """Save notes to a local file with organized directory structure"""
        try:
            # Create a filename with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{Config.NOTES_DIRECTORY}/notes_{timestamp}.json"
            
            notes_data = {
                'video_id': st.session_state.video_id,
                'notes': st.session_state.notes,
                'summary': st.session_state.summary,
                'timestamps': st.session_state.timestamps,
                'date': datetime.now().isoformat()
            }
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(notes_data, f, ensure_ascii=False, indent=4)
            st.success(f"Notes saved successfully to {filename}!")
            
        except Exception as e:
            st.error(f"Error saving notes: {str(e)}")

    @staticmethod
    def load_notes():
        """Load previously saved notes with file selection"""
        try:
            # Get list of available note files
            notes_files = [f for f in os.listdir(Config.NOTES_DIRECTORY) 
                         if f.endswith('.json')]
            
            if not notes_files:
                st.info("No saved notes found.")
                return
            
            # Let user select which file to load
            selected_file = st.selectbox(
                "Select notes to load:",
                notes_files,
                format_func=lambda x: x.replace('.json', '').replace('notes_', '')
            )
            
            if selected_file:
                filepath = os.path.join(Config.NOTES_DIRECTORY, selected_file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    notes_data = json.load(f)
                    st.session_state.video_id = notes_data.get('video_id')
                    st.session_state.notes = notes_data.get('notes', '')
                    st.session_state.summary = notes_data.get('summary', '')
                    st.session_state.timestamps = notes_data.get('timestamps', [])
                    st.success("Notes loaded successfully!")
                    
        except Exception as e:
            st.error(f"Error loading notes: {str(e)}")