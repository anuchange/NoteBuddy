import React from 'react';
import { Code2, Cpu, Workflow } from 'lucide-react';

const highlights = [
  {
    icon: <Code2 className="w-8 h-8" />,
    title: "AI-Powered Development",
    description: "Leverage advanced AI to write, review, and optimize code with unprecedented efficiency."
  },
  {
    icon: <Workflow className="w-8 h-8" />,
    title: "Seamless Integration",
    description: "Works with your existing tools and workflows, enhancing productivity without disruption."
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Intelligent Assistance",
    description: "Context-aware suggestions and automated refactoring to improve code quality."
  }
];

export function About() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">About The Product</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Revolutionizing software development with AI-powered intelligence that understands your code, your intent, and your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {highlights.map((item, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-all transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-xl bg-cyan-400/20 flex items-center justify-center mb-6 text-cyan-400">
                {item.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}