# NoteBuddy 📝

An AI-powered note-taking application that automatically generates comprehensive notes from YouTube videos. With an interactive editor and an AI assistant to help with your learning journey.

## ✨ Features

- **Automatic Note Generation**: Convert any YouTube video into well-structured notes using LLaMA 70B model
- **Smart AI Assistant**: Built-in chat assistant powered by LLaMA 11B Vision model for doubt clearing and screenshot analysis
- **Rich Text Editor**: 
  - Multiple formatting options
  - Code syntax highlighting
  - Custom highlighting for important points
  - Export to PDF/DOCX

- **Dual Theme Support**: Switch between dark and light modes
- **Interactive UI**: Particle-based background theme for enhanced user experience
- **Flexible API Usage**: 
  - Use your own Groq API key for unlimited access
  - Try without API key (10-minute session)

## 🚀 Demo

- Frontend: [Vercel Deployment Link](https://mynotebuddy.vercel.app/)
- Backend: [Render.com Deployment Link](https://notebuddy-sogq.onrender.com)
- Alternative: Streamlit Version Available

## 🛠️ Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Zustand

### Backend
- FastAPI
- Groq API
- LLaMA Models:
  - 70B for note generation
  - 11B Vision for AI assistant
- yt-dlp for video processing
- YouTube Transcript API
- OpenAIWhisperer Groq API for non-English transcripts

## 🏃‍♂️ Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/anuchange/NoteBuddy.git
   ```

2. Install dependencies
   ```bash
   # Frontend
   cd frontend_code
   npm install

   # Backend
   cd ../src
   pip install -r requirements.txt
   ```

3. Set up environment variables
   ```env
   GROQ_API_KEY=your_api_key
   GROQ_VISION_MODEL=your_api_key
   GROQ_MODEL=your_api_key
   COOKIES=Netscape HTTP Cookie File
   ```

4. Run the development servers
   ```bash
   # Frontend
   npm run dev

   # Backend
   uvicorn main:app --reload
   ```

## 💡 Usage

1. Visit the website and click "Get Started"
2. Choose between:
   - Enter your Groq API key for unlimited access
   - Try without API key (5-minute session)
3. Paste a YouTube URL and click "Generate Notes"
4. Wait for the AI to generate notes (Might take more time because of deployment in the hobby account)
5. Use the editor toolbar to format and customize your notes
6. Interact with the AI assistant for any doubts
7. Export your notes in PDF or DOCX format or Print Document for OCR document

## 🎯 Alternative: Streamlit Version

For users who prefer a simpler interface or are not familiar with Next.js:

1. Navigate to the streamlit_src directory
2. Install requirements
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Streamlit app
   ```bash
   streamlit run streamlit_app.py
   ```

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📝 Citation

```bibtex
@software{notebuddy2024,
  title     = {NoteBuddy: AI-Powered YouTube Video Note Generation Tool},
  author    = {Ahmad, Sohail and Vishwakarma, Anurag},
  year      = {2025},
  publisher = {GitHub},
  url       = {https://github.com/anuchange/notebuddy}
}
```

## 🙏 Acknowledgments

- [Groq](https://groq.com) for their powerful API
- [LLaMA](https://ai.meta.com/llama/) models for AI capabilities
- All contributors and supporters of the project
