import React from 'react';
import type { AppMode } from '../types';
import { User, CreditCard, Users2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ModeSelectorProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode }) => {
  const modes: { id: AppMode; title: string; subtitle: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'pfp',
      title: 'Format A: PFP Frame',
      subtitle: 'X Profile Overlay & Avatar',
      icon: <User className="w-5 h-5" />,
    },
    {
      id: 'id_card',
      title: 'Format B: Builder ID Card',
      subtitle: 'Event Resident Pass',
      icon: <CreditCard className="w-5 h-5" />,
      badge: 'BUILDER PASS',
    },
    {
      id: 'team_pass',
      title: 'Bonus: Squad Combined Frame',
      subtitle: 'Bring Teammates Together',
      icon: <Users2 className="w-5 h-5" />,
      badge: 'TEAM SQUAD',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-5 sm:mb-8">
      {/* Mobile Compact 3-Tab Segmented Selector (< md) */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#064423]/85 backdrop-blur-xl rounded-2xl border-3 border-black pop-shadow md:hidden">
        {modes.map((m) => {
          const isActive = mode === m.id;
          const shortLabels: Record<AppMode, string> = {
            pfp: 'PFP Frame',
            id_card: 'Builder ID',
            team_pass: 'Squad Pass',
          };
          return (
            <button
              key={m.id}
              onClick={() => {
                soundManager.playClick();
                setMode(m.id);
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition cursor-pointer border-2 ${
                isActive
                  ? 'bg-[#FFE600] text-black border-black pop-shadow font-black'
                  : 'bg-[#0a6c38] text-slate-100 border-black/80 hover:border-black hover:bg-[#0c7840]'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center mb-1 border-2 border-black ${
                  isActive
                    ? 'bg-[#FF007A] text-white pop-shadow'
                    : 'bg-[#064423] text-[#FFE600]'
                }`}
              >
                {React.cloneElement(m.icon as React.ReactElement<{ className?: string }>, {
                  className: 'w-3.5 h-3.5',
                })}
              </div>
              <span className={`text-[11px] font-display font-black leading-tight truncate w-full ${isActive ? 'text-black' : 'text-slate-100'}`}>
                {shortLabels[m.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop / Tablet Rich Cards (md: and up) with prominent borders on non-selected buttons */}
      <div className="hidden md:grid md:grid-cols-3 gap-3.5 p-3 pt-4 bg-[#064423]/85 backdrop-blur-xl rounded-2xl border-4 border-black pop-shadow-lg">
        {modes.map((m) => {
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                soundManager.playClick();
                setMode(m.id);
              }}
              className={`relative flex items-center space-x-3.5 p-4 rounded-xl text-left transition-all duration-150 cursor-pointer border-3 border-black ${
                isActive
                  ? 'bg-[#FFE600] text-black pop-shadow font-bold'
                  : 'bg-[#0a6c38] text-white shadow-[3px_3px_0px_#000000] hover:bg-[#0d7d43] hover:shadow-[4px_4px_0px_#000000] hover:-translate-y-0.5'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-lg flex items-center justify-center border-2 border-black shrink-0 ${
                  isActive
                    ? 'bg-[#FF007A] text-white pop-shadow'
                    : 'bg-[#064423] text-[#FFE600] shadow-[2px_2px_0px_#000000]'
                }`}
              >
                {m.icon}
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-display font-black truncate ${isActive ? 'text-black' : 'text-[#FFE600]'}`}>
                    {m.title}
                  </span>
                </div>
                <p className={`text-xs truncate ${isActive ? 'text-slate-900 font-medium' : 'text-slate-200'}`}>
                  {m.subtitle}
                </p>
              </div>

              {m.badge && (
                <span
                  className={`absolute -top-2.5 right-3 px-2 py-0.5 rounded-md text-[9px] font-mono font-black tracking-wider border-2 border-black shadow-[2px_2px_0px_#000000] z-10 ${
                    isActive
                      ? 'bg-[#FF007A] text-white'
                      : 'bg-[#FFE600] text-black'
                  }`}
                >
                  {m.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
