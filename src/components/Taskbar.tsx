import { WindowState } from '../App';

interface TaskbarProps {
  time: Date;
  windows: WindowState[];
  startMenuOpen: boolean;
  onToggleStart: () => void;
  onFocusWindow: (id: string) => void;
  horrorLevel: number;
}

export default function Taskbar({ time, windows, startMenuOpen, onToggleStart, onFocusWindow, horrorLevel }: TaskbarProps) {
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const timeStr = formatTime(time);
  
  // After horror level 3, time display gets weird
  const displayTime = horrorLevel >= 3 && Math.random() > 0.7
    ? timeStr.split('').map(c => Math.random() > 0.7 ? String.fromCharCode(33 + Math.floor(Math.random() * 93)) : c).join('')
    : timeStr;

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-10 flex items-center px-1
        ${horrorLevel >= 4 ? 'heavy-glitch' : ''}
      `}
      style={{
        background: '#c0c0c0',
        borderTop: '2px solid #ffffff',
      }}
    >
      {/* Start Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleStart();
        }}
        className={`win95-button flex items-center gap-1 h-7 px-2 font-bold
          ${startMenuOpen ? 'border-color: #808080 #ffffff #ffffff #808080' : ''}
          ${horrorLevel >= 3 ? 'glitch-text' : ''}
        `}
        style={{
          borderStyle: 'solid',
          borderWidth: '2px',
          borderColor: startMenuOpen
            ? '#808080 #ffffff #ffffff #808080'
            : '#ffffff #808080 #808080 #ffffff',
        }}
      >
        <span className="text-sm">🪟</span>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: '14px' }}>
          {horrorLevel >= 4 ? 'R̵U̵N̵' : 'Start'}
        </span>
      </button>

      {/* Divider */}
      <div className="w-px h-6 mx-2 bg-gray-500" />

      {/* Window buttons */}
      <div className="flex-1 flex items-center gap-1 overflow-hidden">
        {windows.map((win) => (
          <button
            key={win.id}
            onClick={() => onFocusWindow(win.id)}
            className={`win95-button h-6 px-2 text-left truncate max-w-[150px]
              ${win.isGlitch ? 'glitch-text' : ''}
            `}
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: '12px',
              ...(win.isGlitch ? {
                borderColor: '#808080 #ffffff #ffffff #808080',
                background: '#ff0000',
                color: '#ffffff',
              } : {}),
            }}
          >
            {win.title}
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div
        className="flex items-center gap-2 h-7 px-2 win95-border-inset"
        style={{ fontFamily: "'VT323', monospace", fontSize: '14px' }}
      >
        <span className={`${horrorLevel >= 2 ? 'text-red-600' : ''}`}>
          🔊
        </span>
        <span className={`${horrorLevel >= 3 ? 'glitch-text text-red-600' : ''}`}>
          {displayTime}
        </span>
      </div>
    </div>
  );
}
