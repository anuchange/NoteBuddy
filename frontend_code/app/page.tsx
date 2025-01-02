import React from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { About } from "../components/About";
import { Creator } from "../components/Creator";
import { Footer } from "../components/Footer";
import { ParticleBackground } from "../components/ParticleBackground/ParticleBackground";

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <ParticleBackground />
      <Header />
      <main>
        <Hero />
        <About />
        <Creator />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

export default App;
