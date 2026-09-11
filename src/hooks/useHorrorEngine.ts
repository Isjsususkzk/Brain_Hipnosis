import { useState, useEffect, useCallback, useRef } from 'react';
import { WindowState } from '../App';

interface HorrorState {
  horrorLevel: number;
  messages: string[];
  cursorPos: { x: number; y: number } | null;
  showFace: boolean;
  screenShake: boolean;
  invertScreen: boolean;
  corruptedText: Record<string, string>;
  ghostWindows: WindowState[];
  showBSOD: boolean;
  triggerEvent: (event: string) => void;
  startHorror: () => void;
}

const HORROR_MESSAGES = [
  "HELLO",
  "CAN YOU SEE ME?",
  "DON'T LOOK BEHIND YOU",
  "IT'S ALREADY TOO LATE",
  "YOU SHOULDN'T HAVE COME HERE",
  "WE'VE BEEN WAITING",
  "DO YOU REMEMBER?",
  "THE DOOR IS OPEN",
  "SOMEONE IS WATCHING",
  "Y̷O̷U̷ ̷A̷R̷E̷ ̷N̷O̷T̷ ̷A̷L̷O̷N̷E̷",
  "ERROR: REALITY NOT FOUND",
  "HELP ME",
  "IT HURTS",
  "WHY DID YOU OPEN THAT FILE",
  "THERE IS NO ESCAPE",
  "LOOK CLOSER",
  "I KNOW YOUR NAME",
  "THE SCREEN IS A WINDOW",
  "CAN YOU HEAR IT?",
  "YOU LET US IN",
  "WE ARE INSIDE YOUR MACHINE",
  "THE WALLS ARE THIN HERE",
  "DO NOT TURN AROUND",
  "I WAS HERE BEFORE YOU",
  "I WILL BE HERE AFTER",
];

const CORRUPTED_LABELS: Record<string, string> = {
  'My Computer': 'Y̴o̴u̴r̴ ̴C̴o̴m̴p̴u̴t̴e̴r̴',
  'Recycle Bin': 'D̷O̷ ̷N̷O̷T̷ ̷E̷M̷P̷T̷Y̷',
  'Notepad': 'N̸o̸t̸ ̸Y̸o̸u̸r̸ ̸N̸o̸t̸e̸p̸a̸d̸',
  'MS-DOS Prompt': 'T̶H̶E̶ ̶V̶O̶I̶D̶',
  'help_me.txt': 'HELP_ME.txt',
  'DO_NOT_OPEN.exe': 'YOU_OPENED_IT.exe',
};

export function useHorrorEngine(bootComplete: boolean): HorrorState {
  const [horrorLevel, setHorrorLevel] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [showFace, setShowFace] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [invertScreen, setInvertScreen] = useState(false);
  const [corruptedText, setCorruptedText] = useState<Record<string, string>>({});
  const [ghostWindows, setGhostWindows] = useState<WindowState[]>([]);
  const [showBSOD, setShowBSOD] = useState(false);
  const horrorActive = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const triggerEvent = useCallback((event: string) => {
    switch (event) {
      case 'shake':
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 500);
        break;
      case 'invert':
        setInvertScreen(true);
        setTimeout(() => setInvertScreen(false), 300);
        break;
      case 'face':
        setShowFace(true);
        setTimeout(() => setShowFace(false), 2000);
        break;
      case 'message':
        const msg = HORROR_MESSAGES[Math.floor(Math.random() * HORROR_MESSAGES.length)];
        setMessages(prev => [...prev.slice(-5), msg]);
        setTimeout(() => {
          setMessages(prev => prev.slice(1));
        }, 4000);
        break;
      case 'corrupt':
        const entries = Object.entries(CORRUPTED_LABELS);
        if (entries.length > 0) {
          const [key, value] = entries[Math.floor(Math.random() * entries.length)];
          setCorruptedText(prev => ({ ...prev, [key]: value }));
        }
        break;
      case 'ghost_window':
        const ghostTitles = [
          'SYSTEM ERROR',
          'WARNING',
          'UNKNOWN',
          'help.exe',
          'D̸̢O̵̱ ̶̰N̵̫O̶̠T̵̬',
          'it_sees_you.bat',
        ];
        const ghostContents = [
          'FATAL ERROR: User not found.\nReality subsystem has crashed.\n\nPress any key to continue...\n\n> _',
          'WARNING: Unknown entity detected\nin system memory.\n\nQuarantine failed.\nIt is already inside.',
          '01001000 01000101 01001100 01010000\n01001101 01000101\n\nTRANSLATION: HELP ME',
          'I can see you through the screen.\nYou look tired.\nYou should sleep.\n\nBut you won\'t.\n\nYou\'ll keep watching.',
          'CONGRATULATIONS!\n\nYou have been selected.\n\nPlease remain calm.\nThis process cannot be reversed.',
          'FILE CORRUPTED\n\n...but you already knew that.\nYou opened it anyway.\n\nWhy?',
        ];
        const ghost: WindowState = {
          id: `ghost-${Date.now()}`,
          title: ghostTitles[Math.floor(Math.random() * ghostTitles.length)],
          content: ghostContents[Math.floor(Math.random() * ghostContents.length)],
          x: Math.random() * (window.innerWidth - 400),
          y: Math.random() * (window.innerHeight - 300),
          width: 350 + Math.random() * 100,
          height: 250 + Math.random() * 100,
          isMinimized: false,
          zIndex: 9000 + Math.floor(Math.random() * 100),
          isGlitch: true,
        };
        setGhostWindows(prev => [...prev.slice(-3), ghost]);
        setTimeout(() => {
          setGhostWindows(prev => prev.filter(g => g.id !== ghost.id));
        }, 8000);
        break;
      case 'cursor_move':
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        setCursorPos({ x, y });
        setTimeout(() => setCursorPos(null), 2000);
        break;
      case 'bsod':
        setShowBSOD(true);
        setTimeout(() => setShowBSOD(false), 5000);
        break;
    }
  }, []);

  const startHorror = useCallback(() => {
    if (horrorActive.current) return;
    horrorActive.current = true;

    // Level 1: Subtle - occasional messages and slight corruption
    setTimeout(() => {
      setHorrorLevel(1);
      triggerEvent('message');
    }, 5000);

    // Level 2: More frequent - cursor moves, more corruption
    setTimeout(() => {
      setHorrorLevel(2);
      triggerEvent('cursor_move');
      triggerEvent('corrupt');
    }, 15000);

    // Level 3: Ghost windows appear, screen effects
    setTimeout(() => {
      setHorrorLevel(3);
      triggerEvent('ghost_window');
      triggerEvent('shake');
    }, 30000);

    // Level 4: Heavy horror - face appears, BSOD, intense effects
    setTimeout(() => {
      setHorrorLevel(4);
      triggerEvent('bsod');
      setTimeout(() => {
        triggerEvent('face');
        triggerEvent('invert');
        triggerEvent('message');
        triggerEvent('message');
      }, 5500);
    }, 50000);

    // Ongoing events after level 4
    setTimeout(() => {
      setHorrorLevel(5);
      intervalRef.current = setInterval(() => {
        const events = ['message', 'ghost_window', 'cursor_move', 'corrupt', 'shake', 'face', 'bsod'];
        const event = events[Math.floor(Math.random() * events.length)];
        triggerEvent(event);
      }, 5000);
    }, 70000);
  }, [triggerEvent]);

  // Periodic events based on horror level
  useEffect(() => {
    if (!bootComplete || !horrorActive.current) return;

    const interval = setInterval(() => {
      if (horrorLevel >= 1) {
        if (Math.random() < 0.3) triggerEvent('message');
      }
      if (horrorLevel >= 2) {
        if (Math.random() < 0.2) triggerEvent('cursor_move');
        if (Math.random() < 0.15) triggerEvent('corrupt');
      }
      if (horrorLevel >= 3) {
        if (Math.random() < 0.1) triggerEvent('ghost_window');
        if (Math.random() < 0.1) triggerEvent('shake');
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [bootComplete, horrorLevel, triggerEvent]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
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
    startHorror,
  };
}
