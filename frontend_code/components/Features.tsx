"use client";
import React from "react";
import { Code, Globe, Cpu } from "lucide-react";

const features = [
  {
    icon: <Code className="w-6 h-6" />,
    title: "Custom Development",
    description: "Tailored solutions built with cutting-edge technology.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Scale",
    description: "Solutions that scale across borders and platforms.",
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "AI Integration",
    description: "Leveraging artificial intelligence for smarter systems.",
  },
];

export function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-purple-400/20 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
