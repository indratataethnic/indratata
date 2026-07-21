/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface SeasonalParticlesProps {
  type: 'rain' | 'leaves' | 'stars' | 'confetti' | 'snow' | 'lanterns' | 'fireworks' | 'none';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  angle?: number;
  spin?: number;
  fade?: number;
  bursts?: { x: number; y: number; color: string; size: number; alpha: number; vx: number; vy: number }[];
}

export const SeasonalParticles: React.FC<SeasonalParticlesProps> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (type === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const maxParticles = type === 'rain' ? 120 : type === 'snow' ? 80 : 50;

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Helper to generate a random particle based on season type
    const createParticle = (initY = false): Particle => {
      const x = Math.random() * canvas.width;
      const y = initY ? Math.random() * canvas.height : -10;
      
      switch (type) {
        case 'rain':
          return {
            x,
            y,
            vx: -0.5 + Math.random() * 1,
            vy: 8 + Math.random() * 6,
            size: 1 + Math.random() * 2,
            color: 'rgba(14, 165, 233, 0.4)', // Sky blue
            alpha: 0.3 + Math.random() * 0.5
          };
        case 'snow':
          return {
            x,
            y,
            vx: -1 + Math.random() * 2,
            vy: 1 + Math.random() * 2,
            size: 2 + Math.random() * 4,
            color: '#ffffff',
            alpha: 0.4 + Math.random() * 0.6
          };
        case 'leaves':
          return {
            x,
            y,
            vx: -1.5 + Math.random() * 2,
            vy: 1.2 + Math.random() * 1.5,
            size: 4 + Math.random() * 6,
            color: Math.random() > 0.5 ? '#10b981' : '#f59e0b', // green or amber autumn leaves
            alpha: 0.6 + Math.random() * 0.4,
            angle: Math.random() * Math.PI * 2,
            spin: -0.02 + Math.random() * 0.04
          };
        case 'confetti': {
          const colors = ['#ec4899', '#f43f5e', '#3b82f6', '#10b981', '#eab308', '#a855f7'];
          return {
            x,
            y,
            vx: -2 + Math.random() * 4,
            vy: 2 + Math.random() * 4,
            size: 4 + Math.random() * 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 0.8 + Math.random() * 0.2,
            angle: Math.random() * Math.PI * 2,
            spin: -0.05 + Math.random() * 0.1
          };
        }
        case 'stars':
          return {
            x,
            y: Math.random() * canvas.height, // Spawn stars all over
            vx: -0.1 + Math.random() * 0.2,
            vy: -0.1 + Math.random() * 0.2,
            size: 1.5 + Math.random() * 3,
            color: '#fef08a', // light yellow stars
            alpha: 0.2 + Math.random() * 0.8,
            fade: Math.random() > 0.5 ? 0.01 : -0.01
          };
        case 'lanterns':
          return {
            x,
            y: canvas.height + 10, // Spawn from bottom
            vx: -0.5 + Math.random() * 1,
            vy: -(0.5 + Math.random() * 1.2), // float up
            size: 6 + Math.random() * 8,
            color: '#f97316', // glowing orange
            alpha: 0.4 + Math.random() * 0.5
          };
        case 'fireworks':
          return {
            x: Math.random() * canvas.width,
            y: canvas.height,
            vx: -1 + Math.random() * 2,
            vy: -(6 + Math.random() * 4), // rise up
            size: 3,
            color: '#facc15',
            alpha: 1,
            bursts: []
          };
        default:
          return {
            x,
            y,
            vx: 0,
            vy: 0,
            size: 2,
            color: '#fff',
            alpha: 0.5
          };
      }
    };

    // Initialize particles across the screen
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        // Draw particle based on type
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (type === 'rain') {
          ctx.beginPath();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 1.5);
          ctx.stroke();
        } else if (type === 'snow') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'stars') {
          // Twinkle
          p.alpha += p.fade || 0;
          if (p.alpha <= 0.1) {
            p.fade = 0.005 + Math.random() * 0.01;
            p.alpha = 0.1;
          } else if (p.alpha >= 0.9) {
            p.fade = -(0.005 + Math.random() * 0.01);
            p.alpha = 0.9;
          }
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'leaves') {
          p.angle = (p.angle || 0) + (p.spin || 0);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.beginPath();
          // Draw leaf shape
          ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'confetti') {
          p.angle = (p.angle || 0) + (p.spin || 0);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 1.5);
        } else if (type === 'lanterns') {
          // Gentle sway
          p.vx += (-0.02 + Math.random() * 0.04);
          if (p.vx > 0.8) p.vx = 0.8;
          if (p.vx < -0.8) p.vx = -0.8;

          ctx.beginPath();
          // Lantern rectangle
          ctx.rect(p.x - p.size / 2, p.y - p.size, p.size, p.size * 1.4);
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
        } else if (type === 'fireworks') {
          if (p.bursts && p.bursts.length > 0) {
            // Draw fireworks explosion burst
            p.bursts.forEach((b) => {
              ctx.save();
              ctx.globalAlpha = b.alpha;
              ctx.fillStyle = b.color;
              ctx.beginPath();
              ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();

              // Update burst particle
              b.x += b.vx;
              b.y += b.vy;
              b.vy += 0.05; // gravity
              b.alpha -= 0.02; // fade
            });

            // Filter out dead burst particles
            p.bursts = p.bursts.filter(b => b.alpha > 0);
          } else {
            // Rocket rising
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.fill();

            // Spawn sparks trail
            ctx.fillStyle = 'rgba(253, 224, 71, 0.5)';
            ctx.fillRect(p.x - 1, p.y + 4, 2, 3);
          }
        }
        ctx.restore();

        // Update Position
        if (type === 'fireworks') {
          if (!p.bursts || p.bursts.length === 0) {
            p.x += p.vx;
            p.y += p.vy;

            // Explode at peak or randomly
            if (p.vy >= -1 || p.y < canvas.height * 0.2 + Math.random() * (canvas.height * 0.4)) {
              // Create bursts
              const colors = ['#f43f5e', '#60a5fa', '#34d399', '#fbbf24', '#c084fc', '#fb7185'];
              const chosenColor = colors[Math.floor(Math.random() * colors.length)];
              const burstCount = 15 + Math.floor(Math.random() * 15);
              for (let b = 0; b < burstCount; b++) {
                const burstAngle = Math.random() * Math.PI * 2;
                const speed = 1 + Math.random() * 3.5;
                p.bursts!.push({
                  x: p.x,
                  y: p.y,
                  vx: Math.cos(burstAngle) * speed,
                  vy: Math.sin(burstAngle) * speed,
                  size: 1.5 + Math.random() * 1.5,
                  color: chosenColor,
                  alpha: 1
                });
              }
            }
          } else if (p.bursts && p.bursts.length === 0) {
            // Rocket already exploded and all burst elements faded away, reset rocket
            particles[index] = createParticle();
          }
        } else {
          p.x += p.vx;
          p.y += p.vy;

          // Recycle particles that go out of bounds
          if (p.y > canvas.height + 20 || p.x > canvas.width + 20 || p.x < -20 || (type === 'lanterns' && p.y < -20)) {
            particles[index] = createParticle();
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [type]);

  if (type === 'none') return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
