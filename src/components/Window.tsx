import { useState } from 'react';
import { WindowState } from '../App';

interface WindowProps {
  windowState: WindowState;
  onClose: () => void;
  onFocus: () => void;
  horrorLevel: number;
  isGhost?: boolean;
}

export default function Window({ windowState, onClose, onFocus, horrorLevel, isGhost }: WindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const { id, title, content, x, y, width, height, zIndex, isGlitch } = windowState;

  const style: React.CSSProperties = isMaximized
    ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 40, zIndex }
    : { position: 'absolute', top: y, left: x, width, height, zIndex };

  return (
    <div
      className={`flex flex-col ${isGhost ? 'animate-[distort-appear_0.5s_ease-out]' : ''}`}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onFocus();
      }}
    >
      {/* Title bar */}
      <div
        className={`flex items-center justify-between px-1 py-0.5 h-6 shrink-0
          ${isGlitch ? 'glitch-text' : ''}
          ${isGhost ? 'bg-red-900' : ''}
        `}
        style={{
          background: isGhost
            ? '#8b0000'
            : 'linear-gradient(90deg, #000080, #1084d0)',
          color: 'white',
        }}
      >
        <span
          className="text-xs font-bold truncate px-1"
          style={{ fontFamily: "'VT323', monospace", fontSize: '13px' }}
        >
          {isGhost ? title.split('').map((c, i) =>
            Math.random() > 0.7 ? String.fromCharCode(33 + Math.floor(Math.random() * 93)) : c
          ).join('') : title}
        </span>
        <div className="flex gap-0.5">
          <button
            className="w-4 h-4 flex items-center justify-center text-xs"
            style={{
              background: '#c0c0c0',
              border: '1px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              fontFamily: "'VT323', monospace",
            }}
            onClick={(e) => { e.stopPropagation(); }}
          >
            _
          </button>
          <button
            className="w-4 h-4 flex items-center justify-center text-xs"
            style={{
              background: '#c0c0c0',
              border: '1px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              fontFamily: "'VT323', monospace",
            }}
            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
          >
            □
          </button>
          <button
            className="w-4 h-4 flex items-center justify-center text-xs"
            style={{
              background: '#c0c0c0',
              border: '1px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              fontFamily: "'VT323', monospace",
            }}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex-1 overflow-auto p-2 bg-white
          ${isGhost ? 'bg-black text-red-500' : ''}
          ${isGlitch ? 'screen-tear' : ''}
        `}
        style={{
          border: '2px solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          fontFamily: "'VT323', monospace",
          fontSize: '14px',
        }}
      >
        {isGhost ? (
          <div className="whitespace-pre-wrap">
            {content.split('\n').map((line, i) => (
              <div
                key={i}
                className={`${Math.random() > 0.8 ? 'glitch-text' : ''}`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-sm" style={{ fontFamily: "'VT323', monospace" }}>
            {content}
          </pre>
        )}

        {/* Horror: random text appearing in windows */}
        {horrorLevel >= 3 && Math.random() > 0.8 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="text-red-600 text-4xl font-bold opacity-20 glitch-text"
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '12px' }}
            >
              HELP
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
