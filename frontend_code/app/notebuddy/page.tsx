"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// import Quill from "../components/quill";
import ChatBotUI from "../../components/chatbot";
// import Button from "../../components/button";
import axios from "axios";
// import NotesEditor from "../../components/notesEditor2";
import Editor from "../../components/editor_component/Editor";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [notesData, setNotesData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: `<h1>Introduction to International Relations and Diplomacy</h1>
    <h2>Key Concepts and Definitions:</h2>
    <ul>
      <li><strong>Diplomacy:</strong> The official channel of communication between two countries, involving negotiations, dialogues, and agreements to maintain peaceful relations.</li>
      <li><strong>International Relations:</strong> The study of interactions among nations, including their governments, economies, cultures, and histories.</li>
      <li><strong>Global Politics:</strong> The complex web of relationships and interactions between different nations and international organizations.</li>
    </ul>`,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  const extractVideoId = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(youtubeUrl);
    if (id) {
      setVideoId(id);
    } else {
      alert("Please enter a valid YouTube URL");
    }
  };

  const handleGenerateNotes = async (videoId: string) => {
    setIsLoading(true);

    try {
      const res = await axios.post("http://0.0.0.0:8000/api/notes", {
        videoId: youtubeUrl,
      });
      setNotesData(res.data.replace(/&para;/g, ""));
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating notes:", error);
      alert("Failed to generate notes. Please try again later.");
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") || "light";
      setTheme(storedTheme);
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-6`}>
      {/* Theme Toggle Button */}
      <div className="flex justify-end">
        {/* <button
          onClick={toggleTheme}
          className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle {theme === "light" ? "Dark" : "Light"} Mode
        </button> */}
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full border-2 transition-all mb-2 ${
            theme === "dark"
              ? "border-gray-700 bg-gray-800 text-yellow-500 hover:bg-gray-700 focus:ring focus:ring-yellow-500"
              : "border-gray-300 bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring focus:ring-gray-500"
          }`}
        >
          {theme === "dark" ? (
            // Light Theme Icon (Sun)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m8.66-11.66l-.71.71M5.05 18.36l-.71-.71m13.02-6.71h1M3 12h1m16.95 6.36l-.71-.71M5.05 5.05l-.71.71M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ) : (
            // Dark Theme Icon (Moon)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto grid-template-columns-1.5fr 2fr">
        {/* Left Column - YouTube Section */}
        <div className="">
          <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">YouTube Video Notes</h2>
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Enter YouTube URL"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Load
                </button>
              </div>
            </form>

            {videoId && (
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              {videoId && (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={() => handleGenerateNotes(videoId)}
                  disabled={isLoading}
                >
                  <span>Generate Notes</span>
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                </button>
              )}
            </div>
          </div>
          <div className="mt-6">
            <ChatBotUI theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
        <Editor notesData={notesData} theme={theme} videoId={videoId} />
      </div>
    </div>
  );
}