import { useState, useEffect, useCallback, useRef } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import StartMenu from './components/StartMenu';
import HorrorOverlay from './components/HorrorOverlay';
import BootScreen from './components/BootScreen';
import ContextMenu from './components/ContextMenu';
import { useHorrorEngine } from './hooks/useHorrorEngine';
import { AudioEngine } from './utils/audioEngine';

export interface WindowState {
  id: string;
  title: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  zIndex: number;
  isGlitch?: boolean;
}

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [booted, setBooted] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [time, setTime] = useState(new Date('1997-10-31T23:59:00'));
  const audioRef = useRef<AudioEngine | null>(null);

  const {
    horrorLevel,
    messages,
    cursorPos,
    showFace,
    screenShake,
    invertScreen,
    corruptedText,
    ghostWindows,
    showBSOD,
    triggerEvent,
    startHorror
  } = useHorrorEngine(bootComplete);

  // Initialize audio engine
  useEffect(() => {
    audioRef.current = new AudioEngine();
    
    // Initialize audio on first user interaction
    const initAudio = () => {
      if (audioRef.current) {
        audioRef.current.init();
        document.removeEventListener('click', initAudio);
        document.removeEventListener('keydown', initAudio);
      }
    };
    document.addEventListener('click', initAudio);
    document.addEventListener('keydown', initAudio);
    
    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
      audioRef.current?.dispose();
    };
  }, []);

  // Boot sequence
  useEffect(() => {
    const timer = setTimeout(() => setBooted(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (booted) {
      const timer = setTimeout(() => setBootComplete(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [booted]);

  // Start horror engine after boot
  useEffect(() => {
    if (bootComplete) {
      const timer = setTimeout(() => {
        startHorror();
      }, 15000); // 15 seconds of "normal" before horror begins
      return () => clearTimeout(timer);
    }
  }, [bootComplete, startHorror]);

  // Update clock
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        const newTime = new Date(prev.getTime() + 60000);
        // After horror starts, time gets weird
        if (horrorLevel > 3) {
          const randomOffset = Math.random() * 100000 - 50000;
          return new Date(newTime.getTime() + randomOffset);
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [horrorLevel]);

  // Play ambient audio based on horror level
  useEffect(() => {
    if (audioRef.current && bootComplete) {
      if (horrorLevel >= 1 && horrorLevel < 3) {
        audioRef.current.playAmbientDrone();
      } else if (horrorLevel >= 3) {
        audioRef.current.playDistortedAmbience();
      }
    }
  }, [horrorLevel, bootComplete]);

  // Play stinger on high horror events
  useEffect(() => {
    if (showFace && audioRef.current) {
      audioRef.current.playStinger();
    }
  }, [showFace]);

  const openWindow = useCallback((title: string, content: string, width = 400, height = 300) => {
    const id = `window-${Date.now()}-${Math.random()}`;
    const newWindow: WindowState = {
      id,
      title,
      content,
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 100,
      width,
      height,
      isMinimized: false,
      zIndex: nextZIndex,
    };
    setWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const handleDesktopClick = useCallback(() => {
    setStartMenuOpen(false);
  }, []);

  if (showIntro) {
    return (
      <div 
        style={{ 
          width: '100vw', 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexDirection: 'column',
          gap: '20px',
          cursor: 'pointer',
          position: 'relative',
          background: '#000000',
          overflow: 'hidden'
        }}
        onClick={() => setShowIntro(false)}
      >
        {/* Bright red warning box to ensure visibility */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#ff0000',
          color: '#ffffff',
          padding: '10px 30px',
          fontSize: '20px',
          fontFamily: "'VT323', 'Courier New', monospace",
          fontWeight: 'bold',
          border: '3px solid #ff0000',
          zIndex: 100
        }}>
          ⚠ WARNING ⚠
        </div>

        <div style={{ textAlign: 'center', padding: '20px', zIndex: 10 }}>
          <div style={{ color: '#ff0000', fontSize: '32px', marginBottom: '25px', fontFamily: "'VT323', 'Courier New', monospace", fontWeight: 'bold' }}>
            ⚠ WARNING ⚠
          </div>
          <div style={{ color: '#e0e0e0', fontSize: '26px', marginBottom: '25px', fontFamily: "'VT323', 'Courier New', monospace", lineHeight: '1.4' }}>
            This experience contains flashing images,<br/>
            distorted audio, and unsettling content.
          </div>
          <div style={{ color: '#a0a0a0', fontSize: '22px', marginBottom: '35px', fontFamily: "'VT323', 'Courier New', monospace" }}>
            Best experienced with headphones in a dark room.
          </div>
          <div style={{ 
            color: '#ffffff', 
            fontSize: '28px', 
            fontFamily: "'VT323', 'Courier New', monospace", 
            fontWeight: 'bold',
            border: '2px solid #ffffff',
            padding: '15px 30px',
            display: 'inline-block'
          }}>
            ▶ CLICK ANYWHERE TO BEGIN ◀
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '40px', color: '#808080', textAlign: 'center', fontFamily: "'VT323', 'Courier New', monospace", fontSize: '18px', zIndex: 10 }}>
          <div>EVIDENCE FILE: recovered_system_image_1997-10-31.img</div>
          <div style={{ marginTop: '8px' }}>SOURCE: Unknown — Case #4471 — STATUS: UNRESOLVED</div>
        </div>
      </div>
    );
  }

  if (!booted) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-green-400 font-mono text-xl animate-pulse" style={{ fontFamily: "'VT323', monospace", fontSize: '20px' }}>
          BIOS v2.14 ... Checking memory ... OK
        </div>
      </div>
    );
  }

  if (!bootComplete) {
    return <BootScreen />;
  }

  const containerClasses = [
    'crt-screen',
    horrorLevel >= 2 ? 'flicker' : '',
    horrorLevel >= 3 ? 'vhs-tracking' : '',
    horrorLevel >= 4 ? 'heavy-glitch' : '',
    horrorLevel >= 5 ? 'color-distort' : '',
    screenShake ? 'shake' : '',
    invertScreen ? 'inverted' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {/* Static noise overlay */}
      <div className={`static-noise ${horrorLevel >= 2 ? 'active' : ''}`} />

      {/* Main desktop */}
      <div
        className="w-full h-full relative"
        style={{
          backgroundColor: horrorLevel >= 4 ? '#1a0000' : horrorLevel >= 2 ? '#005050' : '#008080',
          transition: 'background-color 5s ease',
        }}
        onClick={handleDesktopClick}
      >
        {/* Desktop icons */}
        <Desktop
          onOpenWindow={openWindow}
          horrorLevel={horrorLevel}
          corruptedText={corruptedText}
        />

        {/* Open windows */}
        {windows.map(win => (
          <Window
            key={win.id}
            windowState={win}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            horrorLevel={horrorLevel}
          />
        ))}

        {/* Ghost windows (appear on their own) */}
        {ghostWindows.map((gw: WindowState, i: number) => (
          <Window
            key={`ghost-${i}`}
            windowState={gw}
            onClose={() => {}}
            onFocus={() => {}}
            horrorLevel={horrorLevel}
            isGhost
          />
        ))}

        {/* Start Menu */}
        {startMenuOpen && (
          <StartMenu
            horrorLevel={horrorLevel}
            onSelect={(item: string) => {
              setStartMenuOpen(false);
              if (item === 'notepad') {
                openWindow('Notepad', 'Welcome to MyOS Notepad.\n\nType anything here...', 350, 250);
              } else if (item === 'explorer') {
                openWindow('My Computer', 'C:\\\n├── Windows\n├── Program Files\n├── Documents\n├── DO_NOT_OPEN.exe\n└── help_me.txt', 400, 300);
              } else if (item === 'terminal') {
                openWindow('MS-DOS Prompt', 'C:\\> _', 450, 300);
              }
            }}
          />
        )}

        {/* Taskbar */}
        <Taskbar
          time={time}
          windows={windows}
          startMenuOpen={startMenuOpen}
          onToggleStart={() => setStartMenuOpen(!startMenuOpen)}
          onFocusWindow={focusWindow}
          horrorLevel={horrorLevel}
        />

        {/* BSOD */}
        {showBSOD && (
          <div
            className="absolute inset-0 z-[10005] flex items-center justify-center p-8"
            style={{ backgroundColor: '#0000aa', fontFamily: "'VT323', monospace" }}
            onClick={() => triggerEvent('message')}
          >
            <div className="text-white text-center max-w-lg">
              <div className="bg-white text-blue-900 inline-block px-2 py-0.5 mb-4 font-bold text-sm">
                MyOS
              </div>
              <div className="text-left text-sm leading-relaxed">
                <p className="mb-4">
                  A fatal exception 0x0E has occurred at 0028:C0034B03
                  in VXD VMM(01) + 00010B03. The current application
                  will be terminated.
                </p>
                <p className="mb-4">
                  ERROR: CONSCIOUSNESS_OVERFLOW
                  REALITY_MODULE has encountered an unrecoverable fault.
                </p>
                <p className="mb-4">
                  The entity known as "USER" has exceeded maximum
                  observation parameters. The barrier between
                  observer and observed has collapsed.
                </p>
                <p className="mb-4">
                  Press any key to continue your existence _
                </p>
                <p className="text-xs opacity-50 mt-8">
                  * It won't help.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VHS timestamp overlay */}
        <div
          className="absolute top-3 right-3 pointer-events-none z-[10000]"
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
          }}
        >
          <div>REC ●</div>
          <div className="text-xs">
            {time.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
          </div>
          <div className="text-xs">
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          {horrorLevel >= 2 && (
            <div className="text-red-500 text-xs mt-1 animate-pulse">
              PLAY ▶
            </div>
          )}
        </div>

        {/* Context menu */}
        <ContextMenu
          horrorLevel={horrorLevel}
          onSelect={(action: string) => {
            if (action === 'sees' || action === 'look' || action === 'leave') {
              triggerEvent('face');
              triggerEvent('shake');
            } else if (action === 'refresh') {
              triggerEvent('message');
            }
          }}
        />

        {/* Horror overlay effects */}
        <HorrorOverlay
          horrorLevel={horrorLevel}
          messages={messages}
          cursorPos={cursorPos}
          showFace={showFace}
          triggerEvent={triggerEvent}
        />
      </div>
    </div>
  );
}

export default App;
