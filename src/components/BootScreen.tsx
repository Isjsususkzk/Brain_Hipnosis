import { useEffect, useState } from 'react';

export default function BootScreen() {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootLines = [
    'MyOS 95 Boot Sequence v2.14',
    'Copyright (c) 1995-1997 MyOS Corporation',
    '',
    'Checking RAM... 64MB OK',
    'Detecting IDE drives...',
    '  Primary Master: QUANTUM FIREBALL 2.1GB',
    '  Primary Slave: ATAPI CD-ROM',
    '',
    'Loading system files...',
    '  HIMEM.SYS',
    '  EMM386.EXE',
    '  MOUSE.DRV',
    '  SOUND.DRV',
    '',
    'Starting Windows...',
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setLines(prev => [...prev, bootLines[i]]);
        setProgress((i / bootLines.length) * 100);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-black flex flex-col justify-start p-8">
      <div className="font-mono text-sm">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`${
              line.includes('ERROR') || line.includes('WARNING')
                ? 'text-red-500'
                : 'text-gray-300'
            } ${i === lines.length - 1 ? 'animate-pulse' : ''}`}
            style={{
              fontFamily: "'VT323', monospace",
            }}
          >
            {line || '\u00A0'}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="w-64 h-4 win95-border-inset bg-gray-900">
          <div
            className="h-full bg-blue-600 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* MyOS logo */}
      <div className="mt-auto flex items-end justify-center pb-8">
        <div className="text-center">
          <div
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '16px' }}
          >
            MyOS 95
          </div>
          <div className="text-gray-500 text-sm" style={{ fontFamily: "'VT323', monospace" }}>
            Loading your personal computer experience...
          </div>
        </div>
      </div>
    </div>
  );
}
