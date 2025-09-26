"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ShaderAnimationProps {
  className?: string;
  speed?: number;
  colors?: string[];
}

export function ShaderAnimation({ 
  className, 
  speed = 1,
  colors = ["#4f46e5", "#7c3aed", "#ec4899", "#06b6d4"]
}: ShaderAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    let time = 0;

    const animate = () => {
      time += 0.01 * speed;
      
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Create gradient that changes over time
      const gradient = ctx.createLinearGradient(
        Math.sin(time) * width, 
        Math.cos(time * 0.7) * height,
        Math.cos(time * 1.2) * width,
        Math.sin(time * 0.8) * height
      );
      
      // Animate colors
      colors.forEach((color, index) => {
        const position = (Math.sin(time + index) + 1) / 2;
        gradient.addColorStop(Math.min(1, Math.max(0, position)), color);
      });
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Add some noise/texture
      ctx.globalCompositeOperation = "overlay";
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 3;
        const opacity = Math.random() * 0.1;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fillRect(x, y, size, size);
      }
      
      ctx.globalCompositeOperation = "source-over";
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClient, speed, colors]);

  if (!isClient) {
    return <div className={cn("w-full h-full bg-gradient-to-br from-blue-500 to-purple-600", className)} />;
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full shader-canvas", className)}
    />
  );
}