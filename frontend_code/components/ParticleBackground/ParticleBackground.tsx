"use client";
import React from "react";
import { useParticleAnimation } from "./useParticleAnimation";

export function ParticleBackground() {
  const canvasRef = useParticleAnimation();

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ background: "black" }}
    />
  );
}
