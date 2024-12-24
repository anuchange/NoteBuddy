import streamlit as st
from PIL import ImageGrab, Image
import io
from datetime import datetime
import tkinter as tk
from tkinter import ttk

class ChatManager:
    def __init__(self):
        """Initialize chat manager"""
        self._init_session_state()
    
    def _init_session_state(self):
        """Initialize session state variables for chat"""
        if 'chat_messages' not in st.session_state:
            st.session_state.chat_messages = []
        if 'temp_image' not in st.session_state:
            st.session_state.temp_image = None

    def handle_message(self, message: str, role: str = "user", image=None):
        """
        Add a message to the chat history
        Args:
            message: Text content of the message
            role: Role of the sender (user/assistant)
            image: Optional image data (PIL Image)
        """
        try:
            msg_data = {
                "time": datetime.now().strftime("%H:%M:%S"),
                "role": role,
                "content": message
            }
            
            # If image is provided
            if image is not None:
                if isinstance(image, (Image.Image, ImageGrab.Image)):
                    # Convert PIL image to bytes
                    img_byte_arr = io.BytesIO()
                    image.save(img_byte_arr, format='PNG')
                    msg_data["image"] = img_byte_arr.getvalue()
                elif isinstance(image, bytes):
                    # If image is already in bytes format
                    msg_data["image"] = image
                
            st.session_state.chat_messages.append(msg_data)
            return True
        except Exception as e:
            st.error(f"Failed to add message: {str(e)}")
            return False

    def capture_screenshot(self):
        """Capture partial screenshot using Tkinter selection"""
        try:
            # Create root window and make it invisible
            root = tk.Tk()
            root.attributes('-alpha', 0.01)  # Almost invisible
            root.attributes('-topmost', True)
            
            # Get screen dimensions
            screen_width = root.winfo_screenwidth()
            screen_height = root.winfo_screenheight()
            
            # Variables to store selection coordinates
            start_x = tk.IntVar(root)
            start_y = tk.IntVar(root)
            end_x = tk.IntVar(root)
            end_y = tk.IntVar(root)
            selecting = tk.BooleanVar(root, False)
            
            # Create selection canvas
            selection_canvas = tk.Canvas(
                root,
                width=screen_width,
                height=screen_height,
                highlightthickness=0
            )
            selection_canvas.pack()
            
            def start_selection(event):
                selecting.set(True)
                start_x.set(event.x)
                start_y.set(event.y)
                
            def update_selection(event):
                if selecting.get():
                    # Clear previous rectangle
                    selection_canvas.delete("selection")
                    # Draw new rectangle
                    selection_canvas.create_rectangle(
                        start_x.get(), start_y.get(),
                        event.x, event.y,
                        outline="red",
                        width=2,
                        tags="selection"
                    )
                
            def end_selection(event):
                selecting.set(False)
                end_x.set(event.x)
                end_y.set(event.y)
                root.quit()
            
            # Bind mouse events
            selection_canvas.bind("<Button-1>", start_selection)
            selection_canvas.bind("<B1-Motion>", update_selection)
            selection_canvas.bind("<ButtonRelease-1>", end_selection)
            
            # Make window fullscreen
            root.attributes('-fullscreen', True)
            
            # Start event loop
            root.mainloop()
            
            # Get coordinates
            x1, y1 = min(start_x.get(), end_x.get()), min(start_y.get(), end_y.get())
            x2, y2 = max(start_x.get(), end_x.get()), max(start_y.get(), end_y.get())
            
            # Clean up
            root.destroy()
            
            # Capture the selected area
            if x2 > x1 and y2 > y1:  # Valid selection
                screenshot = ImageGrab.grab(bbox=(x1, y1, x2, y2))
                
                # Store in session state
                st.session_state.temp_image = screenshot
                
                return True
                
            return False
            
        except Exception as e:
            st.error(f"Failed to capture screenshot: {str(e)}")
            return False

    def get_messages(self):
        """Get all chat messages"""
        return st.session_state.chat_messages

    def get_temp_image(self):
        """Get currently stored temporary image"""
        return st.session_state.temp_image

    def clear_temp_image(self):
        """Clear temporary stored image"""
        st.session_state.temp_image = None

    def clear_chat(self):
        """Clear all chat history and temporary data"""
        st.session_state.chat_messages = []
        st.session_state.temp_image = None