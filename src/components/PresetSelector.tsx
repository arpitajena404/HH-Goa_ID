import React from 'react';
import type { FramePreset } from '../types';
import { FRAME_PRESETS } from '../utils/presets';
import { Sparkles, Palette } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PresetSelectorProps {
  selectedPreset: FramePreset;
  onSelectPreset: (preset: FramePreset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  selectedPreset,
  onSelectPreset,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-black tracking-wider text-[#FFE600] flex items-center space-x-1.5">
          <Palette className="w-4 h-4 text-[#FFE600]" />
          <span>GOA COLOR PALETTE</span>
        </label>
        <span className="text-xs font-mono font-bold text-white bg-[#064423] px-2 py-0.5 rounded border border-black">
          {selectedPreset.name}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
        {FRAME_PRESETS.map((p) => {
          const isSelected = selectedPreset.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                soundManager.playClick();
                onSelectPreset(p);
              }}
              className={`flex flex-col p-2 sm:p-3 rounded-xl text-left transition-all border-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#FFE600] text-black border-black pop-shadow font-bold'
                  : 'bg-[#064423] text-white border-black/40 hover:bg-[#09572e]'
              }`}
            >
              <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  <div
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-1.5 sm:border-2 border-black shrink-0"
                    style={{ backgroundColor: p.themeColor }}
                  />
                  <div
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-1.5 sm:border-2 border-black shrink-0"
                    style={{ backgroundColor: p.accentColor }}
                  />
                  <div
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-1.5 sm:border-2 border-black shrink-0 hidden xs:block"
                    style={{ backgroundColor: p.bgGreen }}
                  />
                </div>
                {isSelected && <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF007A] shrink-0" />}
              </div>

              <span className={`text-[11px] sm:text-xs font-black truncate ${isSelected ? 'text-black' : 'text-[#FFE600]'}`}>
                {p.name}
              </span>
              <span className={`text-[9px] sm:text-[10px] truncate mt-0.5 hidden sm:block ${isSelected ? 'text-slate-900' : 'text-slate-300'}`}>
                {p.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
