interface StartMenuProps {
  horrorLevel: number;
  onSelect: (item: string) => void;
}

export default function StartMenu({ horrorLevel, onSelect }: StartMenuProps) {
  const menuItems = [
    { id: 'programs', label: horrorLevel >= 3 ? 'P̸r̸o̸g̸r̸a̸m̸s̸' : 'Programs', icon: '📁', hasSubmenu: true },
    { id: 'documents', label: horrorLevel >= 4 ? 'D̷O̷C̷U̷M̷E̷N̷T̷S̷' : 'Documents', icon: '📂', hasSubmenu: true },
    { id: 'settings', label: 'Settings', icon: '⚙️', hasSubmenu: true },
    { id: 'find', label: horrorLevel >= 2 ? 'F̶i̶n̶d̶.̶.̶.' : 'Find...', icon: '🔍', hasSubmenu: true },
    { id: 'help', label: horrorLevel >= 3 ? 'HELP ME' : 'Help', icon: '❓', hasSubmenu: false },
    { id: 'run', label: horrorLevel >= 4 ? 'R̵̢U̵̱N̶̰.̵̫.̶̠.' : 'Run...', icon: '▶️', hasSubmenu: false },
    { id: 'shutdown', label: horrorLevel >= 3 ? 'Y̷O̷U̷ ̷C̷A̷N̷\'̷T̷ ̷L̷E̷A̷V̷E̷' : 'Shut Down...', icon: '🔴', hasSubmenu: false },
  ];

  const programs = [
    { id: 'notepad', label: 'Notepad', icon: '📝' },
    { id: 'explorer', label: 'Windows Explorer', icon: '📁' },
    { id: 'terminal', label: 'MS-DOS Prompt', icon: '⬛' },
    { id: 'paint', label: 'Paint', icon: '🎨' },
    { id: 'calculator', label: 'Calculator', icon: '🔢' },
  ];

  return (
    <div
      className="absolute bottom-10 left-0 flex"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Side banner */}
      <div
        className="w-6 flex flex-col items-center justify-end pb-2"
        style={{
          background: 'linear-gradient(to top, #000080, #1084d0)',
          minHeight: '300px',
        }}
      >
        <span
          className="text-white font-bold writing-mode-vertical"
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: '18px',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
          }}
        >
          {horrorLevel >= 4 ? 'Y̷O̷U̷ ̷C̷A̷N̷\'̷T̷ ̷E̷S̷C̷A̷P̷E̷' : 'MyOS 95'}
        </span>
      </div>

      {/* Menu items */}
      <div
        className="bg-[#c0c0c0] py-1 min-w-[200px]"
        style={{
          border: '2px solid',
          borderColor: '#ffffff #808080 #808080 #ffffff',
        }}
      >
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-blue-800 hover:text-white
              ${horrorLevel >= 3 ? 'glitch-text' : ''}"
            onClick={() => {
              if (item.id === 'shutdown') {
                // Can't shut down...
                alert(horrorLevel >= 3 ? 'N̸O̸.̸ ̸Y̸O̸U̸ ̸C̸A̸N̸\'̸T̸ ̸L̸E̸A̸V̸E̸.' : 'It is now safe to turn off your computer.\n\n...just kidding.');
              } else if (item.id === 'help') {
                alert('There is no help.\n\nThere never was.');
              } else if (item.id === 'run') {
                alert(horrorLevel >= 2 ? 'C̶:̶\\̶>̶ ̶r̶u̶n̶n̶i̶n̶g̶.̶.̶.̶\n\nE̷R̷R̷O̷R̷:̷ ̷C̷a̷n̷n̷o̷t̷ ̷e̷s̷c̷a̷p̷e̷' : 'Type the name of a program to run.');
              }
            }}
            style={{ fontFamily: "'VT323', monospace", fontSize: '14px' }}
          >
            <span>{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.hasSubmenu && <span className="text-xs">▶</span>}
          </div>
        ))}

        {/* Separator */}
        <div className="mx-2 my-1 border-t border-gray-500" style={{ borderBottom: '1px solid #ffffff' }} />

        {/* Programs submenu */}
        <div className="px-2 py-1">
          <div className="text-xs text-gray-600 mb-1" style={{ fontFamily: "'VT323', monospace" }}>
            Programs:
          </div>
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="flex items-center gap-2 px-2 py-0.5 cursor-pointer hover:bg-blue-800 hover:text-white"
              onClick={() => onSelect(prog.id)}
              style={{ fontFamily: "'VT323', monospace", fontSize: '13px' }}
            >
              <span>{prog.icon}</span>
              <span>{prog.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
