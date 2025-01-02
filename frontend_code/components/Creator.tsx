"use client";
import React from "react";
import { Github, Twitter } from "lucide-react";

export function Creator() {
  return (
    <section
      id="work"
      className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Created by developers, for developers
            </h2>
            <p className="text-gray-400 mb-8">
              With decades of combined experience in software development, our
              team understands the challenges developers face daily. We're
              building the tools we've always wanted.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-400/20 p-1">
              <div className="w-full h-full rounded-2xl bg-black/50 backdrop-blur-sm p-8">
                <div className="h-full border border-white/10 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
