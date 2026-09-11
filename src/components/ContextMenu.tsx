import { useState, useEffect } from 'react';

interface ContextMenuProps {
  horrorLevel: number;
  onSelect: (action: string) => void;
}

export default function ContextMenu({ horrorLevel, onSelect }: ContextMenuProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleClick = () => {
      setVisible(false);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  if (!visible || !pos) return null;

  const menuItems = horrorLevel >= 3
    ? [
        { label: 'V̸i̸e̸w̸', action: 'view' },
        { label: 'R̵e̵f̵r̵e̵s̵h̵', action: 'refresh' },
        { label: '─' , action: '' },
        { label: 'I̶T̶ ̶S̶E̶E̶S̶ ̶Y̶O̶U̶', action: 'sees' },
        { label: 'D̷O̷ ̷N̷O̷T̷ ̷L̷O̷O̷K̷', action: 'look' },
        { label: '─', action: '' },
        { label: 'Y̸O̸U̸ ̸C̸A̸N̸\'̸T̸ ̸L̸E̸A̸V̸E̸', action: 'leave' },
      ]
    : [
        { label: 'View', action: 'view' },
        { label: 'Arrange Icons', action: 'arrange' },
        { label: 'Line Up Icons', action: 'lineup' },
        { label: '─', action: '' },
        { label: 'Refresh', action: 'refresh' },
        { label: '─', action: '' },
        { label: 'Paste', action: 'paste' },
        { label: 'New', action: 'new' },
        { label: '─', action: '' },
        { label: 'Properties', action: 'properties' },
      ];

  return (
    <div
      className="fixed z-[10004]"
      style={{
        top: pos.y,
        left: pos.x,
        background: '#c0c0c0',
        border: '2px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        minWidth: '160px',
        fontFamily: "'VT323', monospace",
        fontSize: '14px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item, i) => (
        item.label === '─' ? (
          <div key={i} className="mx-1 my-0.5 border-t border-gray-500" style={{ borderBottom: '1px solid #ffffff' }} />
        ) : (
          <div
            key={i}
            className="px-4 py-0.5 cursor-pointer hover:bg-blue-800 hover:text-white
              ${horrorLevel >= 3 ? 'glitch-text' : ''}"
            onClick={() => {
              onSelect(item.action);
              setVisible(false);
            }}
          >
            {item.label}
          </div>
        )
      ))}
    </div>
  );
}
