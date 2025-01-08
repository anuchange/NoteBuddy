"use client";
import React, {useEffect} from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { About } from "../components/About";
import { Creator } from "../components/Creator";
import { Footer } from "../components/Footer";
import { ParticleBackground } from "../components/ParticleBackground/ParticleBackground";

function App() {
  useEffect(()=>{
    // try {
          // const res = await axios.post("https://notebuddy-qxlo.onrender.com
      (async()=>{
        try{
          const res = await axios.get("https://notebuddy-qxlo.onrender.com");
        } catch(e){
          console.log("Error", e);
        }
      })()
  }, [])
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
