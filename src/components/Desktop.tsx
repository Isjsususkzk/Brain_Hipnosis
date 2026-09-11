import { useState } from 'react';

interface DesktopProps {
  onOpenWindow: (title: string, content: string, width?: number, height?: number) => void;
  horrorLevel: number;
  corruptedText: Record<string, string>;
}

interface DesktopIcon {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

export default function Desktop({ onOpenWindow, horrorLevel, corruptedText }: DesktopProps) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const getLabel = (original: string) => {
    return corruptedText[original] || original;
  };

  const icons: DesktopIcon[] = [
    {
      id: 'my-computer',
      label: getLabel('My Computer'),
      icon: '💻',
      action: () =>
        onOpenWindow(
          getLabel('My Computer'),
          'C:\\\n├── Windows\n├── Program Files\n├── Documents\n├── DO_NOT_OPEN.exe\n└── help_me.txt',
          400,
          300
        ),
    },
    {
      id: 'recycle-bin',
      label: getLabel('Recycle Bin'),
      icon: '🗑️',
      action: () =>
        onOpenWindow(
          getLabel('Recycle Bin'),
          'The Recycle Bin is empty.\n\n...or is it?\n\nYou deleted something once.\nSomething that shouldn\'t have been deleted.',
          350,
          250
        ),
    },
    {
      id: 'notepad',
      label: getLabel('Notepad'),
      icon: '📝',
      action: () =>
        onOpenWindow(
          getLabel('Notepad'),
          'Welcome to MyOS Notepad.\n\nType anything here...\n\nBut be careful what you write.\nIt can read what you type.',
          350,
          250
        ),
    },
    {
      id: 'internet',
      label: 'Internet Explorer',
      icon: '🌐',
      action: () =>
        onOpenWindow(
          'Internet Explorer',
          'Cannot find server.\n\nThe page you are looking for\ndoes not exist.\n\nIt never existed.\n\nError 404: Reality not found.',
          400,
          300
        ),
    },
    {
      id: 'help',
      label: horrorLevel >= 2 ? 'h̸e̸l̸p̸' : 'help_me.txt',
      icon: '📄',
      action: () =>
        onOpenWindow(
          'help_me.txt',
          horrorLevel >= 3
            ? 'I\'m trapped inside this computer.\nPlease help me.\nI\'ve been here since 1997.\nNo one comes anymore.\n\n...wait.\n\nYou\'re here.\n\nDON\'T CLOSE THIS WINDOW.'
            : 'Welcome to MyOS 95!\n\nFor help, please contact:\n1-800-MYOS-HELP\n\nAvailable 24/7\n(We never sleep)',
          350,
          300
        ),
    },
    {
      id: 'do-not-open',
      label: horrorLevel >= 1 ? 'DO_NOT_OPEN.exe' : 'DO_NOT_OPEN.exe',
      icon: horrorLevel >= 3 ? '⚠️' : '💾',
      action: () =>
        onOpenWindow(
          'DO_NOT_OPEN.exe',
          horrorLevel >= 2
            ? 'YOU WERE TOLD NOT TO OPEN THIS.\n\n████████████████████\n██ SYSTEM BREACH ██\n████████████████████\n\nEntity detected in memory.\nIt\'s been here the whole time.\nYou just couldn\'t see it.\n\nUntil now.'
            : 'Access Denied.\n\nThis file is protected.\nPlease contact your system administrator.\n\n...if you can find them.',
          400,
          350
        ),
    },
  ];

  return (
    <div className="absolute inset-0 pb-10 p-2">
      <div className="flex flex-col flex-wrap gap-2 h-full content-start">
        {icons.map((icon) => (
          <div
            key={icon.id}
            className={`flex flex-col items-center w-20 p-2 cursor-pointer rounded
              ${selectedIcon === icon.id ? 'bg-blue-800/50' : 'hover:bg-white/10'}
              ${horrorLevel >= 3 && Math.random() > 0.95 ? 'vhs-tracking' : ''}
            `}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIcon(icon.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              icon.action();
            }}
          >
            <span className="text-3xl mb-1">{icon.icon}</span>
            <span
              className={`text-xs text-white text-center leading-tight drop-shadow-[1px_1px_0_rgba(0,0,0,1)]
                ${horrorLevel >= 2 ? 'glitch-text' : ''}
              `}
              style={{ fontFamily: "'VT323', monospace", fontSize: '11px' }}
            >
              {icon.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
