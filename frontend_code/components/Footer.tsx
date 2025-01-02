"use client";
import React from "react";
import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="contact"
      className="py-12 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Terminal className="w-6 h-6 text-cyan-400" />
              <span className="font-bold text-xl">emergent</span>
            </div>
            <p className="text-gray-400">
              Building the future of code intelligence.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Emergent. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
