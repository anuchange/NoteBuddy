import streamlit as st
import pandas as pd

class UIComponents:
    @staticmethod
    def initialize_session_state():
        """Initialize session state variables if they don't exist"""
        if 'notes' not in st.session_state:
            st.session_state.notes = ""
        if 'summary' not in st.session_state:
            st.session_state.summary = ""
        if 'video_id' not in st.session_state:
            st.session_state.video_id = None
        if 'timestamps' not in st.session_state:
            st.session_state.timestamps = []

    @staticmethod
    def display_timestamps():
        """Display timestamps in an interactive table"""
        if st.session_state.timestamps:
            st.subheader("Important Moments")
            timestamps_df = pd.DataFrame(st.session_state.timestamps)
            timestamps_df['time'] = timestamps_df['time'].apply(
                lambda x: f"{int(x//60)}:{int(x%60):02d}"
            )
            st.dataframe(
                timestamps_df,
                height=200,
                column_config={
                    "time": "Timestamp",
                    "text": "Content"
                }
            )

    @staticmethod
    def display_notes_editor():
        """Display the notes editor with markdown support"""
        st.markdown("### Your Notes")
        notes = st.text_area(
            "",  # Empty label for cleaner look
            value=st.session_state.notes,
            height=400,
            key="notes_area",
            placeholder="Start typing your notes here... Use markdown for formatting!"
        )
        st.session_state.notes = notes

    @staticmethod
    def display_summary():
        """Display AI-generated summary in an expandable section"""
        if st.session_state.summary:
            with st.expander("AI-Generated Summary", expanded=True):
                st.markdown(st.session_state.summary)