"use client";
import React from "react";
import { Terminal } from "lucide-react";
import Image from "next/image";
import Logo from "./icons/logo.svg";

export function Header() {
  return (
    <header className="fixed top-0 w-full border-b border-white/10 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            {/* <Terminal className="w-6 h-6 text-purple-400" /> */}
            <Image src={Logo} alt="NoteBuddy Logo" width={24} height={24} />
            {/* <Logo /> */}
            <span className="font-bold text-xl">NoteBuddy</span>
          </div>
          <nav className="flex space-x-8">
            <a
              href="#about"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              About
            </a>
            <a
              href="#work"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              Work
            </a>
            <a
              href="#contact"
              className="text-sm hover:text-purple-400 transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
