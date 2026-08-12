import React, { useState } from 'react';
import type { BuilderProfile } from '../types';
import { ROLE_PRESETS, TECH_STACK_TAGS, getRandomBuilderClass, generateRandomHashId } from '../utils/presets';
import { User, AtSign, Briefcase, Dices, Layers, ShieldCheck, Plus, X, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BuilderFormProps {
  profile: BuilderProfile;
  setProfile: React.Dispatch<React.SetStateAction<BuilderProfile>>;
}

export const BuilderForm: React.FC<BuilderFormProps> = ({ profile, setProfile }) => {
  const [customTagInput, setCustomTagInput] = useState('');

  const handleRollClass = () => {
    soundManager.playRandomize();
    const newClass = getRandomBuilderClass();
    setProfile((prev) => ({ ...prev, builderClass: newClass }));
  };

  const handleRollId = () => {
    soundManager.playClick();
    const newId = generateRandomHashId();
    setProfile((prev) => ({ ...prev, idNumber: newId }));
  };

  // Select preset role
  const handleSelectRole = (r: string) => {
    soundManager.playClick();
    setProfile((prev) => ({ ...prev, role: r }));
  };

  // Toggle or remove tag
  const toggleStackTag = (tag: string) => {
    soundManager.playClick();
    setProfile((prev) => {
      const exists = prev.techStack.includes(tag);
      if (exists) {
        return { ...prev, techStack: prev.techStack.filter((t) => t !== tag) };
      } else {
        if (prev.techStack.length >= 6) return prev;
        return { ...prev, techStack: [...prev.techStack, tag] };
      }
    });
  };

  const removeStackTag = (tag: string) => {
    soundManager.playClick();
    setProfile((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tag),
    }));
  };

  // Add custom tags (supports single or comma separated, e.g. "Move, Rust, Solana")
  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTagInput.trim()) return;
    soundManager.playClick();

    const newTags = customTagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setProfile((prev) => {
      const combined = [...prev.techStack];
      newTags.forEach((tag) => {
        if (!combined.includes(tag) && combined.length < 6) {
          combined.push(tag);
        }
      });
      return { ...prev, techStack: combined };
    });

    setCustomTagInput('');
  };

  return (
    <div className="space-y-4">
      {/* Name & Handle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-mono font-black text-[#FFE600] mb-1">
            <span className="flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>BUILDER NAME</span>
            </span>
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Satoshi Nomad"
            className="w-full bg-[#064423] border-2 border-black focus:border-[#FFE600] rounded-xl px-3.5 py-2 text-sm text-white font-bold placeholder-slate-400 outline-none transition pop-shadow"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-black text-[#FFE600] mb-1">
            <span className="flex items-center space-x-1">
              <AtSign className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>X / TWITTER HANDLE</span>
            </span>
          </label>
          <input
            type="text"
            value={profile.handle}
            onChange={(e) => setProfile((prev) => ({ ...prev, handle: e.target.value }))}
            placeholder="@username"
            className="w-full bg-[#064423] border-2 border-black focus:border-[#FFE600] rounded-xl px-3.5 py-2 text-sm text-[#FFE600] font-mono font-bold placeholder-slate-400 outline-none transition pop-shadow"
          />
        </div>
      </div>

      {/* Primary Role (Presets + Custom Type Input) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-mono font-black text-[#FFE600] flex items-center space-x-1">
            <Briefcase className="w-3.5 h-3.5 text-[#FF007A]" />
            <span>PRIMARY ROLE (SELECT OR TYPE YOUR OWN)</span>
          </label>
          <span className="text-[11px] font-mono text-[#D4FF00] font-bold">
            Live on Card
          </span>
        </div>

        {/* Preset Role Quick Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2">
          {ROLE_PRESETS.map((r) => {
            const isSelected = profile.role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleSelectRole(r)}
                className={`py-2 px-2 rounded-lg text-xs font-mono text-center truncate transition border-2 border-black cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF007A] text-white font-black pop-shadow'
                    : 'bg-[#064423] text-white hover:bg-[#085a2f]'
                }`}
                title={r}
              >
                {r}
              </button>
            );
          })}
        </div>

        {/* Editable Typing Space for Custom Role */}
        <div className="relative">
          <input
            type="text"
            value={profile.role}
            onChange={(e) => setProfile((prev) => ({ ...prev, role: e.target.value }))}
            placeholder="Type your custom role (e.g. Growth Hacker, Protocol Dev, Designer)..."
            className="w-full bg-[#064423] border-2 border-black focus:border-[#FFE600] rounded-xl px-3.5 py-2 text-sm text-white font-mono font-bold placeholder-slate-400 outline-none transition pop-shadow"
          />
          <span className="absolute right-3 top-2.5 text-[10px] font-mono font-black text-[#FFE600] uppercase bg-[#0a6c38] px-2 py-0.5 rounded border border-black pointer-events-none">
            Active Role
          </span>
        </div>
      </div>

      {/* Dynamic Builder Class Generator */}
      <div className="p-4 bg-[#FFE600] border-3 border-black rounded-2xl pop-shadow">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono font-black text-black flex items-center space-x-1.5">
            <Dices className="w-4 h-4 text-black animate-bounce" />
            <span>GENERATED BUILDER CLASS</span>
          </label>
          <button
            type="button"
            onClick={handleRollClass}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-mono font-black bg-[#FF007A] text-white border-2 border-black pop-shadow hover:bg-pink-600 transition cursor-pointer"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>🎲 Roll Class</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={profile.builderClass}
            onChange={(e) => setProfile((prev) => ({ ...prev, builderClass: e.target.value }))}
            className="w-full bg-[#064423] border-2 border-black rounded-xl px-3.5 py-2 text-sm font-display font-black text-[#FFE600] outline-none"
          />
        </div>
      </div>

      {/* Tech Stack (Active Badges, Preset Pills, and Custom Typing) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-mono font-black text-[#FFE600] flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>TECH STACK (SELECT OR TYPE CUSTOM)</span>
          </label>
          <span className="text-xs font-mono text-slate-300">
            {profile.techStack.length}/6 Selected
          </span>
        </div>

        {/* Currently Active Selected Tech Stack Pills with (X) remove */}
        {profile.techStack.length > 0 && (
          <div className="p-2.5 mb-2 bg-[#064423]/90 rounded-xl border-2 border-black pop-shadow flex items-center flex-wrap gap-1.5">
            <span className="text-[10px] font-mono text-[#FFE600] font-bold mr-1 flex items-center">
              <Sparkles className="w-3 h-3 mr-0.5 text-[#FF007A]" />
              On Card:
            </span>
            {profile.techStack.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-[#FFE600] text-black border border-black pop-shadow"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeStackTag(tag)}
                  className="hover:text-[#FF007A] ml-1 cursor-pointer font-black"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Preset Tech Stack Suggestions */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {TECH_STACK_TAGS.map((tag) => {
            const isSelected = profile.techStack.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleStackTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition border-2 border-black cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF007A] text-white font-black pop-shadow'
                    : 'bg-[#064423] text-white hover:bg-[#09572e]'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Custom Tag Typing Input Box */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            placeholder="Type custom tech stack (e.g. Move, FHE, Orbit, Anchor) & press Add..."
            className="flex-1 bg-[#064423] border-2 border-black rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#FFE600] font-mono font-bold pop-shadow"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomTag(e);
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddCustomTag}
            className="px-4 py-2 rounded-xl bg-[#FFE600] text-black font-black text-xs font-mono border-2 border-black pop-shadow hover:bg-yellow-300 flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add Stack</span>
          </button>
        </div>
      </div>

      {/* ID Number Hash */}
      <div className="flex items-center justify-between p-3 bg-[#064423] rounded-xl border-2 border-black pop-shadow">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#FFE600]" />
          <span className="text-xs font-mono text-white font-bold">
            Resident ID: <span className="text-[#FFE600]">{profile.idNumber}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={handleRollId}
          className="text-xs font-mono font-black text-[#FF007A] bg-[#FFE600] px-2.5 py-1 rounded border border-black hover:bg-yellow-300 transition cursor-pointer"
        >
          Regenerate ID
        </button>
      </div>
    </div>
  );
};
