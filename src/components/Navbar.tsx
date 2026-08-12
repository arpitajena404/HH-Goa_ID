import React from 'react';
import { Volume2, VolumeX, HelpCircle, ExternalLink, Flame } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onOpenHowTo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundEnabled,
  setSoundEnabled,
  onOpenHowTo,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    if (next) soundManager.playToggle();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b-4 border-black bg-[#064423]/95 backdrop-blur-md px-4 lg:px-8 py-3.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: 2:47 PM STUDIO & Brand */}
        <div className="flex items-center space-x-3">
          <a
            href="https://hhgoa.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 group"
          >
            <div className="px-2.5 py-1 bg-[#FFE600] border-2 border-black rounded-lg pop-shadow transform group-hover:-rotate-2 transition">
              <span className="font-mono font-black text-xs text-black tracking-wider">
                2:47 PM STUDIO
              </span>
            </div>
            <div className="flex items-center space-x-1 pl-1">
              <span className="font-serif-hh font-black text-xl text-[#FFE600] tracking-wide">
                HACKER
              </span>
              <span className="font-goa-hindi font-black text-lg text-[#FF007A] bg-[#FFE600] px-1 rounded border border-black transform rotate-3">
                गोवा
              </span>
              <span className="font-serif-hh font-black text-xl text-[#FFE600] tracking-wide">
                HOUSE
              </span>
            </div>
          </a>
        </div>

        {/* Center: #FrameInGoa Live Tag */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#0a6c38] border-2 border-black pop-shadow">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] animate-ping"></span>
          <span className="text-xs font-mono font-bold text-[#FFE600]">
            OFFICIAL #FrameInGoa GENERATOR
          </span>
          <span className="px-1.5 py-0.2 bg-[#FF007A] text-white text-[10px] font-mono font-black rounded border border-black">
            TASK #1
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenHowTo();
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-[#FFE600] text-black border-2 border-black pop-shadow hover:bg-yellow-300 transition cursor-pointer"
            title="Shortlisting Task Submission Guide"
          >
            <HelpCircle className="w-4 h-4 text-black" />
            <span className="hidden sm:inline">How To Post</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl text-black bg-[#D4FF00] border-2 border-black pop-shadow hover:bg-lime-300 transition cursor-pointer"
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-black" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <a
            href="https://hhgoa.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#FF007A] text-white border-2 border-black pop-shadow hover:bg-pink-600 transition"
          >
            <Flame className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>hhgoa.com</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>
    </header>
  );
};
