"use client";
import React, { useState } from "react";
import { X, ExternalLink, Key } from "lucide-react";
import useStore from "../app/lib/store";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// const setCookie = (cookieName, cookieValue, expiryDate) => {
//   Cookies.set(cookieName, cookieValue, {
//     path: "/", // Path where the cookie is accessible
//     expires: expiryDate, // Expiration in days
//     sameSite: "strict", // Prevent cross-site request forgery
//     secure: true, // Use secure cookies (only sent over HTTPS)
//   });

//   console.log("Cookie set successfully!");
// };

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKeyData: string | null) => void;
}

export function ApiKeyModal({ isOpen, onClose, onSubmit }: ApiKeyModalProps) {
  const [apiKeyData, setApiKeyData] = useState("");
  const { apiKey, setApikey } = useStore();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApikey(apiKeyData);
    // onSubmit(apiKeyData);
    if (apiKeyData) {
      router.push("/notebuddy");
    }
  };

  const setCookie = (name, value, expiryTime) => {
    const expiry = new Date().getTime() + expiryTime; // Expiry time in milliseconds
    const cookieValue = JSON.stringify({ value, expiry }); // JSON string
    document.cookie = `${name}=${encodeURIComponent(cookieValue)}; path=/;`;
  };

  // Example: Set a userSession cookie for 10 minutes
  // setCookie("userSession", { user: "demoUser" }, 10 * 60 * 1000);

  const handleTryIt = () => {
    // onSubmit(null);
    router.push("/notebuddy");
    // setCookie("userSession", "user_expiry", 0.000694444);
    setCookie("userSession", { user: "demoUser" }, 5 * 60 * 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-black border border-white/10 rounded-2xl max-w-md w-full p-6 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-12 h-12 rounded-full bg-cyan-400/20 flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Enter your GROQ API Key</h2>
          <p className="text-gray-400">
            To access the full potential of our AI-powered code intelligence,
            please provide your GROQ API key.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={apiKeyData}
              onChange={(e) => setApiKeyData(e.target.value)}
              placeholder="sk-xxxxxx..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            />
          </div>

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              className="w-full bg-cyan-400 text-black font-medium py-3 rounded-lg hover:bg-cyan-300 transition-colors"
            >
              Continue
            </button>

            <button
              type="button"
              onClick={handleTryIt}
              className="w-full bg-white/5 text-white font-medium py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Try Without API Key
            </button>
          </div>
        </form>

        <div className="mt-6 text-sm text-gray-400">
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-cyan-400 transition-colors"
          >
            <span>Get your API key from GROQ Console</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
