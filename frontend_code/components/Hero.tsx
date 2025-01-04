"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ApiKeyModal } from "./ApiKeyModal";

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApiKeySubmit = (apiKey: string | null) => {
    // Here you would typically send the API key to your backend
    console.log("API Key:", apiKey ? "Provided" : "None");
    setIsModalOpen(false);
    // Add your redirect logic here
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-4xl mx-auto text-center animate-fade-in z-10">
        <div className="space-y-4 mb-8">
          {/* <h2 className="text-6xl sm:text-8xl font-bold">A</h2>
          <h2 className="text-6xl sm:text-8xl font-bold">new</h2> */}
          <h2 className="text-4xl sm:text-5xl font-bold">
            Navigate the Future of
          </h2>
          <h2 className="text-6xl sm:text-8xl font-bold text-cyan-400">
            Digital Learning
          </h2>
        </div>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Where AI meets learning, creating notes that matter.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="group bg-white text-black px-8 py-4 text-lg font-medium inline-flex items-center space-x-2 hover:bg-cyan-400 transition-colors"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleApiKeySubmit}
      />
    </section>
  );
}
