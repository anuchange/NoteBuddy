"use client";
import React from "react";
import { Terminal } from "lucide-react";
import Image from "next/image";
import Logo from "./icons/logo.svg";

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
              <Image src={Logo} alt="NoteBuddy Logo" width={24} height={24} />
              <span className="font-bold text-xl">NoteBuddy</span>
            </div>
            <p className="text-gray-400">
              Where AI meets learning, creating notes that matter.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Github</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="https://github.com/Sohailahmad7692"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Sohail Ahmad
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/anuchange"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Anurag Vishwakarma
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">LinkedIn</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="https://www.linkedin.com/in/sohail-ahmad-225a52169/"
                  className="hover:text-cyan-400 transition-colors"
                >
                  sohail-ahmad-225a52169/
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/anurag-vishwakarma-4a9a37168/"
                  className="hover:text-cyan-400 transition-colors"
                >
                  anurag-vishwakarma-4a9a37168/
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Mail</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="mailto:sohailahmad7692@gmail.com"
                  className="hover:text-cyan-400 transition-colors"
                >
                  sohailahmad7692@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:anuchange128@gmail.com"
                  className="hover:text-cyan-400 transition-colors"
                >
                  anuchange128@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} NoteBuddy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
