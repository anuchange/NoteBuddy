"use client";
import React, { useState, useRef } from "react";
import { Send, ImageIcon, X } from "lucide-react";
import Button from "./button";
import axios from "axios";

const MessageType = {
  TEXT: "text",
  IMAGE: "image",
};

const ChatBotUI = () => {
  const [currentQuery, setCurrentQuery] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
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
    <div className="w-full max-w-2xl mx-auto h-[600px] bg-white rounded-xl shadow-lg flex flex-col">
      <div className="flex flex-col h-full p-6 gap-4">
        {/* Header */}
        <div className="border-b pb-4">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            AI Assistant
          </h2>
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto rounded-xl bg-gray-50 p-6">
          {currentQuery && (
            <div className="mb-6">
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white px-4 py-3 rounded-xl max-w-[80%] shadow-sm">
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
              <div className="bg-gray-200 px-4 py-2 rounded-xl">
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
              <div className="bg-white text-gray-800 px-4 py-3 rounded-xl max-w-[80%] shadow-sm">
                <div
                  className="break-words [&>h1]:scroll-m-20 [&>h1]:text-4xl [&>h1]:font-extrabold [&>h1]:tracking-tight [&>h1]:lg:text-5xl
                             [&>h2]:scroll-m-20 [&>h2]:text-3xl [&>h2]:font-semibold [&>h2]:tracking-tight [&>h2]:first:mt-0
                             [&>h3]:scroll-m-20 [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:tracking-tight
                             [&>h4]:scroll-m-20 [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:tracking-tight
                             [&>h5]:scroll-m-20 [&>h5]:text-lg [&>h5]:font-semibold [&>h5]:tracking-tight
                             [&>h6]:scroll-m-20 [&>h6]:text-base [&>h6]:font-semibold [&>h6]:tracking-tight
                             [&>p]:leading-7 [&>p]:mb-4"
                  dangerouslySetInnerHTML={{ __html: currentResponse }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Selected Image Preview */}
        {selectedImage && (
          <div className="relative inline-block">
            <img
              src={selectedImage}
              alt="Selected"
              className="h-20 w-20 object-cover rounded-lg shadow-sm"
            />
            <Button
              variant="destructive"
              size="small"
              className="absolute -top-2 -right-2 rounded-full shadow-sm"
              onClick={() => {
                setSelectedImage(null);
                fileInputRef.current.value = "";
              }}
            >
              <X className="h-4 w-4" />
            </Button>
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
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
            className="rounded-xl"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-5 w-5" />
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
