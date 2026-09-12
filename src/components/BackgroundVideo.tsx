import React, { useState, useEffect, useRef } from 'react';

export const BackgroundVideo: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight > window.innerWidth;
    }
    return false;
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Detect orientation changes (vertical vs horizontal)
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const videoSrc = isPortrait
    ? '/ssstik.io_@astrospaceq_1789184894877.mp4'
    : '/ssstik.io_@snshortsyt_1789184938844.mp4';

  // Programmatically trigger video playback on source change / mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback, canvas handles display
      });
    }
  }, [videoSrc]);

  // Starfield canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const numStars = 350;
    const stars = Array.from({ length: numStars }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      size: Math.random() * 2 + 0.5,
      color: ['#ffffff', '#a5b4fc', '#38bdf8', '#f472b6', '#fbbf24'][
        Math.floor(Math.random() * 5)
      ],
    }));

    let time = 0;
    const render = () => {
      time += 0.01;
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, width, height);

      // Nebula ambient glow
      const cx = width / 2;
      const cy = height / 2;
      const grad1 = ctx.createRadialGradient(
        cx + Math.sin(time) * 100,
        cy + Math.cos(time * 0.8) * 100,
        20,
        cx,
        cy,
        Math.max(width, height) * 0.7
      );
      grad1.addColorStop(0, 'rgba(126, 34, 206, 0.25)');
      grad1.addColorStop(0.5, 'rgba(14, 165, 233, 0.15)');
      grad1.addColorStop(1, 'rgba(5, 8, 17, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Stars warp flight
      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.z -= 2.5;
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 250 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;

        if (px >= 0 && px < width && py >= 0 && py < height) {
          const size = Math.max(0.5, (1 - star.z / width) * star.size * 2.5);
          const alpha = Math.min(1, (1 - star.z / width) * 1.2);

          ctx.fillStyle = star.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      id="space-background-video-wrapper"
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-20 bg-[#050811]"
    >
      {/* Canvas space background behind video */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Main looping video */}
      <video
        ref={videoRef}
        key={videoSrc}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-700"
      />

      {/* Dark tint overlay for pristine contrast */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />
    </div>
  );
};

