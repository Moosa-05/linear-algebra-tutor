import React, { useEffect, useRef } from 'react';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let intervalId: any;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // Attach listener to window to track mouse even outside the canvas/prompt box
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    resizeCanvas();

    // Standard Matrix Chars + Math Symbols
    const chars = 'XYZ01αβγδεζηθικλμνξοπρστυφχψωΣΠ∫∂√∞≈≠≤≥∆∇∈∉∅⊂⊃∀∃∄'; 
    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);
    
    // Individual speed for each column to feel more organic
    const speeds = new Array(columns).fill(0).map(() => 0.7 + Math.random() * 0.6);

    const draw = () => {
      // Trail effect: Fade out previous frame slightly
      ctx.fillStyle = 'rgba(2, 6, 23, 0.28)'; // Dark Slate-950 base
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- 1. Cursor Spotlight (Atmospheric Glow) ---
      // This creates a flashlight effect around the mouse
      if (mouseRef.current.x > 0) {
          const gradient = ctx.createRadialGradient(
              mouseRef.current.x, mouseRef.current.y, 0, 
              mouseRef.current.x, mouseRef.current.y, 350
          );
          gradient.addColorStop(0, 'rgba(34, 211, 238, 0.08)'); // Very faint Cyan center
          gradient.addColorStop(1, 'rgba(2, 6, 23, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(mouseRef.current.x, mouseRef.current.y, 350, 0, Math.PI * 2);
          ctx.fill();
      }

      ctx.font = `bold ${fontSize}px "Courier New", monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Interaction Logic: Distance from mouse
        const dx = x - mouseRef.current.x;
        const dy = y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let text = chars[Math.floor(Math.random() * chars.length)];

        // --- 2. Reactive Zones ---
        if (dist < 80) {
            // ZONE 1: CORE BREACH (Under Mouse)
            // Effect: Pure White, Binary Code Only, Intense Glow
            ctx.fillStyle = '#ffffff'; 
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffffff';
            text = Math.random() > 0.5 ? '1' : '0'; // Glitch to binary
        } else if (dist < 200) {
            // ZONE 2: DISTURBANCE FIELD (Around Mouse)
            // Effect: Cyan Neon, Standard Chars
            ctx.fillStyle = '#06b6d4'; // Cyan-500
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#22d3ee'; // Cyan-400
        } else {
            // ZONE 3: AMBIENT RAIN (Background)
            // Effect: Dark Slate/Indigo, Rare Glitches
            const isGlitch = Math.random() > 0.995;
            if (isGlitch) {
                ctx.fillStyle = '#818cf8'; // Indigo-400
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#6366f1';
            } else {
                ctx.fillStyle = '#1e293b'; // Slate-800
                ctx.shadowBlur = 0;
            }
        }

        ctx.fillText(text, x, y);

        // Falling Logic
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i] += speeds[i]; 
      }
    };

    intervalId = setInterval(draw, 33);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 w-full h-full pointer-events-none"
    />
  );
};

export default MatrixBackground;