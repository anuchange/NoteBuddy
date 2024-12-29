"use client";
import React, { useState, useRef } from "react";
import { Maximize2, Minimize2, Send, ImageIcon, X } from "lucide-react";
import Button from "./button";
import axios from "axios";

const MessageType = {
  TEXT: "text",
  IMAGE: "image",
};

const ChatBotUI = ({ theme, toggleTheme }) => {
  const [currentQuery, setCurrentQuery] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target.result);
        };
        reader.readAsDataURL(file);
        setError("");
      } else {
        setError("Please select an image file");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() || selectedImage) {
      setCurrentQuery(null);
      setCurrentResponse(null);

      const query = {
        id: Date.now(),
        content: inputText,
        type: MessageType.TEXT,
        image: selectedImage,
      };
      setCurrentQuery(query);
      setIsLoading(true);

      try {
        const response = await axios.post("http://0.0.0.0:8000/api/chatbot", {
          query: inputText,
          image: selectedImage,
        });
        setCurrentResponse(response.data.replace(/&para;/g, ""));
      } catch (error) {
        setError("Failed to get response. Please try again.");
      } finally {
        setIsLoading(false);
      }

      setInputText("");
      setSelectedImage(null);
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gray-800 text-gray-200"
          : "bg-white text-gray-900"
      } shadow-lg flex flex-col ${
        isMaximized
          ? "fixed inset-0 w-full h-full z-50"
          : "w-full max-w-2xl mx-auto h-[600px] rounded-xl"
      }`}
    >
      <div className="flex flex-col h-full p-6 gap-4">
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b p-4 ${
            theme === "dark" ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <h2 className="text-xl font-semibold">AI Assistant</h2>
          <button
            onClick={toggleMaximize}
            className={`p-2 rounded-full transition-colors ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            {isMaximized ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </button>
          {/* <button
            onClick={toggleTheme}
            className={`ml-4 p-2 rounded-full transition-colors ${
              theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200"
            }`}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button> */}
        </div>

        {/* Chat Area */}
        <div
          className={`flex-grow overflow-y-auto rounded-xl p-6 ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
          }`}
        >
          {currentQuery && (
            <div className="mb-6">
              <div className="flex justify-end">
                <div
                  className={`${
                    theme === "dark"
                      ? "bg-blue-500 text-white"
                      : "bg-blue-600 text-white"
                  } px-4 py-3 rounded-xl max-w-[80%] shadow-sm`}
                >
                  <p className="break-words m-0">{currentQuery.content}</p>
                  {currentQuery.image && (
                    <img
                      src={currentQuery.image}
                      alt="User uploaded"
                      className="mt-2 max-w-[300px] rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div
                className={`${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                } px-4 py-2 rounded-xl`}
              >
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          {currentResponse && (
            <div className="flex justify-start">
              <div
                className={`${
                  theme === "dark"
                    ? "bg-gray-600 text-gray-200"
                    : "bg-white text-gray-800"
                } px-4 py-3 rounded-xl max-w-[80%] shadow-sm`}
              >
                <div
                  className="break-words [&>h1]:scroll-m-20 [&>h1]:text-3xl [&>h1]:font-extrabold [&>h1]:tracking-tight [&>h1]:lg:text-3xl [&>h1]:text-left
          [&>h2]:scroll-m-20 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:tracking-tight [&>h2]:first:mt-0 [&>h2]:text-left
          [&>h3]:scroll-m-20 [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:tracking-tight [&>h3]:text-left
          [&>h4]:scroll-m-20 [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:tracking-tight [&>h4]:text-left
          [&>h5]:scroll-m-20 [&>h5]:text-lg [&>h5]:font-semibold [&>h5]:tracking-tight [&>h5]:text-left
          [&>h6]:scroll-m-20 [&>h6]:text-base [&>h6]:font-semibold [&>h6]:tracking-tight [&>h6]:text-left
          [&>p]:leading-7 [&>p]:mb-4 [&>p]:text-justify"
                  dangerouslySetInnerHTML={{ __html: currentResponse }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={`${
              theme === "dark"
                ? "bg-red-900 text-red-300"
                : "bg-red-50 text-red-700"
            } border-l-4 p-4 rounded-lg`}
          >
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-3 items-end pt-2">
          <div className="flex-grow">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"
              }`}
            />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            ref={fileInputRef}
          />

          <Button
            variant="outline"
            size="icon"
            className={`rounded-xl ${
              theme === "dark" ? "bg-gray-600 text-white" : ""
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {theme === "dark" ? (
              <ImageIcon size={18} className="text-gray-100" /> // Dark theme icon
            ) : (
              <ImageIcon size={18} className="text-gray-900" /> // Light theme icon
            )}
            {/* <ImageIcon className="h-5 w-5" /> */}
          </Button>

          <Button type="submit" size="icon" className="rounded-xl">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatBotUI;
