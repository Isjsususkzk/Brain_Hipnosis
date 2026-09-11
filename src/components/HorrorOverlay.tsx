import { useEffect, useState } from 'react';

interface HorrorOverlayProps {
  horrorLevel: number;
  messages: string[];
  cursorPos: { x: number; y: number } | null;
  showFace: boolean;
  triggerEvent: (event: string) => void;
}

export default function HorrorOverlay({ horrorLevel, messages, cursorPos, showFace, triggerEvent }: HorrorOverlayProps) {
  const [glitchBars, setGlitchBars] = useState<Array<{ top: number; height: number; offset: number }>>([]);

  // Generate random glitch bars
  useEffect(() => {
    if (horrorLevel < 2) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const bars = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
          top: Math.random() * 100,
          height: Math.random() * 3 + 0.5,
          offset: (Math.random() - 0.5) * 20,
        }));
        setGlitchBars(bars);
        setTimeout(() => setGlitchBars([]), 100);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [horrorLevel]);

  return (
    <>
      {/* Floating horror messages */}
      {messages.map((msg, i) => (
        <div
          key={`${msg}-${i}`}
          className="absolute pointer-events-none glitch-text"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 70}%`,
            color: 'rgba(255, 0, 0, 0.8)',
            fontFamily: "'Press Start 2P', cursive",
            fontSize: `${12 + Math.random() * 20}px`,
            textShadow: '0 0 10px red, 0 0 20px darkred',
            animation: 'face-appear 0.5s ease-out',
            zIndex: 10000,
            transform: `rotate(${(Math.random() - 0.5) * 10}deg)`,
          }}
        >
          {msg}
        </div>
      ))}

      {/* Autonomous cursor */}
      {cursorPos && (
        <div
          className="absolute pointer-events-none z-[10001]"
          style={{
            top: cursorPos.y,
            left: cursorPos.x,
            transition: 'all 0.3s ease-out',
          }}
        >
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M0 0L16 14L8 14L12 24L8 24L4 14L0 18V0Z" fill="white" stroke="black" />
          </svg>
          <div
            className="absolute -top-2 -left-2 w-6 h-6 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,0,0,0.3) 0%, transparent 70%)',
              animation: 'pulse 1s infinite',
            }}
          />
        </div>
      )}

      {/* The Face - appears briefly */}
      {showFace && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[10002]"
          style={{ animation: 'face-appear 0.3s ease-out' }}
        >
          <div className="relative">
            {/* Distorted face using CSS */}
            <div
              className="text-[150px] leading-none"
              style={{
                filter: 'contrast(2) brightness(0.5) hue-rotate(0deg)',
                animation: 'heavy-glitch 0.2s steps(2) infinite',
                textShadow: '0 0 30px rgba(255,0,0,0.5)',
              }}
            >
              👁️
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '10px',
                color: 'red',
                textShadow: '0 0 5px red',
                animation: 'glitch-text 0.1s infinite',
              }}
            >
              I SEE YOU
            </div>
          </div>
        </div>
      )}

      {/* Glitch bars */}
      {glitchBars.map((bar, i) => (
        <div
          key={`bar-${i}-${bar.top}`}
          className="absolute left-0 right-0 pointer-events-none z-[9996]"
          style={{
            top: `${bar.top}%`,
            height: `${bar.height}%`,
            transform: `translateX(${bar.offset}px)`,
            background: `rgba(${Math.random() > 0.5 ? '255,255,255' : '0,0,0'}, ${0.3 + Math.random() * 0.4})`,
            mixBlendMode: Math.random() > 0.5 ? 'overlay' : 'difference',
          }}
        />
      ))}

      {/* VHS tracking lines */}
      {horrorLevel >= 2 && (
        <div className="absolute inset-0 pointer-events-none z-[9995]">
          <div
            className="absolute left-0 right-0 h-[2px] bg-white/20"
            style={{
              top: `${(Date.now() / 50) % 100}%`,
              animation: 'scanline-scroll 3s linear infinite',
            }}
          />
        </div>
      )}

      {/* Corner warning text */}
      {horrorLevel >= 3 && (
        <div
          className="absolute top-2 right-2 pointer-events-none z-[10000]"
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: '12px',
            color: 'rgba(255, 0, 0, 0.6)',
            animation: 'blink 2s steps(1) infinite',
          }}
        >
          ⚠ SIGNAL LOST
        </div>
      )}

      {/* Binary rain effect at high horror */}
      {horrorLevel >= 4 && (
        <div className="absolute inset-0 pointer-events-none z-[9994] overflow-hidden opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`rain-${i}`}
              className="absolute text-green-500"
              style={{
                left: `${i * 5}%`,
                top: '-20px',
                fontFamily: "'VT323', monospace",
                fontSize: '14px',
                animation: `scanline-scroll ${2 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {Array.from({ length: 30 }).map(() =>
                Math.random() > 0.5 ? '1' : '0'
              ).join('\n')}
            </div>
          ))}
        </div>
      )}

      {/* Subliminal flash frames */}
      {horrorLevel >= 4 && Math.random() > 0.95 && (
        <div
          className="absolute inset-0 pointer-events-none z-[10003] bg-black"
          style={{
            animation: 'red-flash 0.1s ease-out',
          }}
        />
      )}
    </>
  );
}
