"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Quill from "../components/quill";
import ChatBotUI from "../components/chatbot";
import Button from "../components/button";
import axios from "axios";
import NotesEditor from "../components/notesEditor2";
import Editor from "../components/editor_component/Editor";

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [notesData, setNotesData] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: `<h1>Introduction to International Relations and Diplomacy</h1>

<h2>Key Concepts and Definitions:</h2>

<ul>
  <li><strong>Diplomacy:</strong> The official channel of communication between two countries, involving negotiations, dialogues, and agreements to maintain peaceful relations.</li>
  <li><strong>International Relations:</strong> The study of interactions among nations, including their governments, economies, cultures, and histories.</li>
  <li><strong>Global Politics:</strong> The complex web of relationships and interactions between different nations and international organizations.</li>
</ul>

<h2>Main Ideas and Supporting Details:</h2>

<ul>
  <li>The lecture transcript discusses Prime Minister Modi's visit to Kuwait, where he met with the Amir of Kuwait, Sheikh Mishal Al-Ahmad Al-Jaber Al-Sabah, to discuss bilateral issues.</li>
  <li>The meeting highlights the importance of diplomatic relations between India and Kuwait, with a focus on labor relations, trade, and cultural exchange.</li>
  <li>Prime Minister Modi also interacted with Indian laborers in Kuwait, emphasizing the significance of their contributions to the Indian economy.</li>
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
    try {
      const res = await axios.post("http://0.0.0.0:8000/api/notes", {
        videoId: youtubeUrl,
      });
      setNotesData(res.data);
    } catch (error) {
      console.error("Error generating notes:", error);
      alert("Failed to generate notes. Please try again later.");
    }
  };

  // const parseHTMLString = (data) => {
  //   const parser = new DOMParser();

  //   // convert html string into DOM
  //   const document = parser.parseFromString(data, "text/html");
  //   console.log("document=", document, data);
  //   return document;
  // };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Left Column - YouTube Section */}
        <div className="">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">YouTube Video Notes</h2>
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Enter YouTube URL"
                  className="flex-1 p-2 border border-gray-300 rounded"
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
            {videoId && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
                onClick={() => {
                  handleGenerateNotes(videoId);
                }}
              >
                Generate Notes
              </button>
            )}
          </div>
          <div className="mt-6">
            <ChatBotUI />
          </div>
          <div className="mt-6">
            <button />
          </div>
        </div>
        {/* <Quill notesData={notesData} /> */}
        <Editor notesData={notesData} />
        {/* <NotesEditor /> */}
      </div>
    </div>
  );
}
