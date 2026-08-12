import React, { useRef } from 'react';
import type { TeamMember, TeamProfile } from '../types';
import { generateSampleAvatarSvg } from '../utils/presets';
import { Users2, UserPlus, Trash2, Upload, ZoomIn, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TeamFormProps {
  team: TeamProfile;
  setTeam: React.Dispatch<React.SetStateAction<TeamProfile>>;
}

export const TeamForm: React.FC<TeamFormProps> = ({ team, setTeam }) => {
  const memberFileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleAddMember = () => {
    if (team.members.length >= 4) return;
    soundManager.playClick();
    const newId = `mem_${Date.now()}`;
    const newMember: TeamMember = {
      id: newId,
      name: `Teammate ${team.members.length + 1}`,
      handle: '',
      role: 'Full-Stack Builder',
      photoUrl: generateSampleAvatarSvg(`T${team.members.length + 1}`, (team.members.length * 60 + 30) % 360),
      transform: {
        zoom: 1,
        panX: 0,
        panY: 0,
        rotation: 0,
        filter: 'normal',
      },
    };
    setTeam((prev) => ({ ...prev, members: [...prev.members, newMember] }));
  };

  const handleRemoveMember = (id: string) => {
    if (team.members.length <= 2) return;
    soundManager.playClick();
    setTeam((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
    }));
  };

  const handleMemberPhotoUpload = (id: string, file: File) => {
    soundManager.playClick();
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setTeam((prev) => ({
          ...prev,
          members: prev.members.map((m) =>
            m.id === id ? { ...m, photoUrl: e.target?.result as string } : m
          ),
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Team Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        <div>
          <label className="block text-xs font-mono font-black text-[#FFE600] mb-1">
            <span className="flex items-center space-x-1">
              <Users2 className="w-3.5 h-3.5 text-[#FFE600]" />
              <span>TEAM / SQUAD NAME</span>
            </span>
          </label>
          <input
            type="text"
            value={team.teamName}
            onChange={(e) => setTeam((prev) => ({ ...prev, teamName: e.target.value }))}
            placeholder="e.g. ZeroLag Protocol"
            className="w-full bg-[#064423] border-2 border-black focus:border-[#FFE600] rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm text-white font-bold outline-none pop-shadow"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-black text-[#FFE600] mb-1">
            <span>SQUAD MOTTO / TAGLINE</span>
          </label>
          <input
            type="text"
            value={team.tagline}
            onChange={(e) => setTeam((prev) => ({ ...prev, tagline: e.target.value }))}
            placeholder="e.g. Heads down · Ship or Ship"
            className="w-full bg-[#064423] border-2 border-black focus:border-[#FFE600] rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm text-white outline-none font-mono pop-shadow"
          />
        </div>
      </div>

      {/* Member Cards Header */}
      <div className="flex items-center justify-between pt-1 sm:pt-2">
        <label className="text-xs font-mono font-black text-[#FFE600] flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF007A]" />
          <span>TEAMMATES ({team.members.length}/4)</span>
        </label>
        {team.members.length < 4 && (
          <button
            type="button"
            onClick={handleAddMember}
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-mono font-black bg-[#FFE600] text-black border-2 border-black pop-shadow hover:bg-yellow-300 transition cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {/* Teammates List */}
      <div className="space-y-2.5 sm:space-y-3">
        {team.members.map((m, idx) => (
          <div
            key={m.id}
            className="p-3 sm:p-3.5 bg-[#064423] rounded-xl border-2 sm:border-3 border-black pop-shadow space-y-2.5 sm:space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-[#FFE600]">
                TEAMMATE 0{idx + 1}
              </span>
              {team.members.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMember(m.id)}
                  className="text-red-400 hover:text-red-300 transition cursor-pointer p-1"
                  title="Remove Teammate"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2">
              <input
                type="text"
                value={m.name}
                onChange={(e) =>
                  setTeam((prev) => ({
                    ...prev,
                    members: prev.members.map((mem) =>
                      mem.id === m.id ? { ...mem, name: e.target.value } : mem
                    ),
                  }))
                }
                placeholder="Member Name"
                className="bg-[#0a6c38] border-2 border-black rounded-lg px-2.5 py-1.5 text-xs text-white font-bold outline-none"
              />

              <input
                type="text"
                value={m.role}
                onChange={(e) =>
                  setTeam((prev) => ({
                    ...prev,
                    members: prev.members.map((mem) =>
                      mem.id === m.id ? { ...mem, role: e.target.value } : mem
                    ),
                  }))
                }
                placeholder="Role (e.g. AI Dev)"
                className="bg-[#0a6c38] border-2 border-black rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-mono"
              />

              <input
                type="text"
                value={m.handle}
                onChange={(e) =>
                  setTeam((prev) => ({
                    ...prev,
                    members: prev.members.map((mem) =>
                      mem.id === m.id ? { ...mem, handle: e.target.value } : mem
                    ),
                  }))
                }
                placeholder="@handle"
                className="bg-[#0a6c38] border-2 border-black rounded-lg px-2.5 py-1.5 text-xs text-[#FFE600] outline-none font-mono font-bold"
              />
            </div>

            {/* Photo upload / sample for this member */}
            <div className="flex items-center justify-between space-x-2 pt-1 flex-wrap gap-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={(el) => {
                    memberFileInputRefs.current[m.id] = el;
                  }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleMemberPhotoUpload(m.id, file);
                  }}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => memberFileInputRefs.current[m.id]?.click()}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-bold bg-[#FFE600] text-black border border-black sm:border-2 pop-shadow cursor-pointer"
                >
                  <Upload className="w-3 h-3 text-black" />
                  <span>Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    const svg = generateSampleAvatarSvg(m.name, (idx * 90 + 40) % 360);
                    setTeam((prev) => ({
                      ...prev,
                      members: prev.members.map((mem) =>
                        mem.id === m.id ? { ...mem, photoUrl: svg } : mem
                      ),
                    }));
                  }}
                  className="text-[11px] sm:text-xs font-mono text-[#FFE600] hover:text-white transition cursor-pointer"
                >
                  Beach Avatar
                </button>
              </div>

              {/* Quick zoom for member */}
              <div className="flex items-center space-x-1.5">
                <ZoomIn className="w-3 h-3 text-white" />
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={m.transform.zoom}
                  onChange={(e) => {
                    const z = parseFloat(e.target.value);
                    setTeam((prev) => ({
                      ...prev,
                      members: prev.members.map((mem) =>
                        mem.id === m.id
                          ? { ...mem, transform: { ...mem.transform, zoom: z } }
                          : mem
                      ),
                    }));
                  }}
                  className="w-16 sm:w-20"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
