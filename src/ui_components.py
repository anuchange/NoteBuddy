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

    # @staticmethod
    # def display_summary():
    #     """Display AI-generated summary in a scrollable, editable format"""
    #     if st.session_state.summary:
    #         # Add custom CSS for scrollable area
    #         st.markdown("""
    #             <style>
    #                 .stTextArea textarea {
    #                     height: 300px !important;
    #                     font-family: 'Arial', sans-serif;
    #                     font-size: 14px;
    #                     line-height: 1.6;
    #                     padding: 10px;
    #                     background-color: #f8f9fa;
    #                 }
    #             </style>
    #         """, unsafe_allow_html=True)

    #         # Display summary in an editable text area
    #         edited_summary = st.text_area(
    #             "AI-Generated Summary",
    #             value=st.session_state.summary,
    #             height=300  # This works with the CSS above
    #         )

    #         # Update the summary in session state if edited
    #         st.session_state.summary = edited_summary


    @staticmethod
    def initialize_chat():
        """Initialize chat-related UI components"""
        if 'chat_manager' not in st.session_state:
            from .chat import ChatManager
            st.session_state.chat_manager = ChatManager()

    @staticmethod
    def display_chat_controls():
        """Display chat control buttons"""
        col1, col2 = st.columns([1, 8])
        with col1:
            if st.button("🗑️", help="Clear Chat"):
                st.session_state.chat_manager.clear_chat()
                st.rerun()

    @staticmethod
    def display_chat_interface():
        """Display chat interface with screenshot functionality"""
        # Ensure chat is initialized
        UIComponents.initialize_chat()
        
        st.write("---")  # Separator
        st.subheader("Chat Assistant")
        
        # Chat container for better organization
        chat_container = st.container()
        
        with chat_container:
            # Screenshot button
            col1, col2 = st.columns([1, 8])
            with col1:
                if st.button("📸", help="Select area to screenshot"):
                    if st.session_state.chat_manager.capture_screenshot():
                        st.success("Screenshot captured! Type your message and press Enter to send.")
            
            # Display existing messages
            for msg in st.session_state.chat_manager.get_messages():
                with st.chat_message(msg["role"]):
                    st.write(msg["content"])
                    if "image" in msg:
                        try:
                            # Convert bytes back to image for display
                            image_bytes = msg["image"]
                            if isinstance(image_bytes, bytes):
                                st.image(image_bytes, use_container_width=True)
                        except Exception as e:
                            st.error(f"Failed to display image: {str(e)}")

            # Chat input
            if prompt := st.chat_input("Ask a question or type a message..."):
                # Handle user message with any pending screenshot
                temp_image = st.session_state.chat_manager.get_temp_image()
                st.session_state.chat_manager.handle_message(
                    message=prompt,
                    image=temp_image
                )
                
                # Get AI response
                from .groq_client import GroqHandler
                groq_handler = GroqHandler()
                
                with st.chat_message("assistant"):
                    response_placeholder = st.empty()
                    full_response = ""
                    
                    # Stream the response
                    for response_chunk in groq_handler.process_streamed_chat(prompt, temp_image):
                        full_response += response_chunk
                        response_placeholder.markdown(full_response + "▌")
                    response_placeholder.markdown(full_response)
                
                # Save assistant's response
                st.session_state.chat_manager.handle_message(
                    message=full_response,
                    role="assistant"
                )
                
                # Clean up
                st.session_state.chat_manager.clear_temp_image()
                st.rerun()