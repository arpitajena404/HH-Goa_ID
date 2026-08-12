import React, { useState } from 'react';
import type { AppMode, BuilderProfile, TeamProfile } from '../types';
import confetti from 'canvas-confetti';
import { Download, Copy, Check, Sparkles, FileImage } from 'lucide-react';
import { soundManager } from '../utils/audio';

// Custom X / Twitter SVG icon
const XTwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface ActionToolbarProps {
  mode: AppMode;
  profile: BuilderProfile;
  team: TeamProfile;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onOpenHowTo: () => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  mode,
  profile,
  team,
  canvasRef,
  onOpenHowTo,
}) => {
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#FFE600', '#FF007A', '#0a6c38', '#D4FF00', '#FFFFFF'],
      });
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    soundManager.playSuccess();
    triggerConfetti();

    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');

    let filename = 'HHGoa2026-Pass.png';
    if (mode === 'id_card') {
      filename = `HHGoa2026-ID-${(profile.name || 'Builder').replace(/\s+/g, '_')}.png`;
    } else if (mode === 'team_pass') {
      filename = `HHGoa2026-Squad-${(team.teamName || 'Team').replace(/\s+/g, '_')}.png`;
    } else {
      filename = `HHGoa2026-PFP-${(profile.name || 'Hacker').replace(/\s+/g, '_')}.png`;
    }

    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    soundManager.playClick();

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setCopiedImage(true);
          soundManager.playSuccess();
          setTimeout(() => setCopiedImage(false), 2500);
        } catch {
          handleDownload();
        }
      }, 'image/png', 1.0);
    } catch {
      handleDownload();
    }
  };

  const generateTweetCaption = () => {
    const liveUrl = window.location.href;
    if (mode === 'team_pass') {
      return `Locked in with my squad "${team.teamName || 'The Builders'}" for @247pmstudio's Hacker House Goa 2026! 🌴⚡\n\nGenerated our official squad frame for #FrameInGoa. See you on the sand in Goa this October!\n\nGenerate your frame: ${liveUrl}\n\n#HHGoa2026 #FrameInGoa #HackerHouseGoa`;
    } else if (mode === 'id_card') {
      return `Locked in as a ${profile.builderClass || 'Goa Beachside Hacker'} for @247pmstudio's Hacker House Goa 2026! 🌴⚡\n\nGenerated my official Builder ID Card for #FrameInGoa. Excited to build, ship, and launch in Goa this Oct 28–31!\n\nGenerate yours: ${liveUrl}\n\n#HHGoa2026 #FrameInGoa #HackerHouseGoa`;
    } else {
      return `Updated my PFP with the official @247pmstudio Hacker House Goa 2026 frame! 🌴⚡\n\nReady to lock in and ship with elite builders on the sand in Goa this October.\n\nGenerate yours: ${liveUrl}\n\n#HHGoa2026 #FrameInGoa #HackerHouseGoa`;
    }
  };

  const handleShareToX = () => {
    soundManager.playClick();
    triggerConfetti();
    const caption = generateTweetCaption();
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyCaption = async () => {
    soundManager.playClick();
    const caption = generateTweetCaption();
    await navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  return (
    <div className="w-full space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
      {/* 1-Click Action Buttons with Neo-Brutalist Pop Shadows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
        {/* 1-Click Download High-Res */}
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center space-x-2 py-3 sm:py-3.5 px-4 sm:px-5 rounded-xl font-display font-black text-xs sm:text-sm text-black bg-[#FFE600] hover:bg-yellow-300 transition-all border-2 sm:border-3 border-black pop-shadow active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>1-CLICK DOWNLOAD (2K HD)</span>
        </button>

        {/* 1-Click Share to X */}
        <button
          onClick={handleShareToX}
          className="w-full flex items-center justify-center space-x-2 py-3 sm:py-3.5 px-4 sm:px-5 rounded-xl font-display font-black text-xs sm:text-sm text-white bg-[#FF007A] hover:bg-pink-600 transition-all border-2 sm:border-3 border-black pop-shadow active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
        >
          <XTwitterIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          <span>SHARE TO X (#FrameInGoa)</span>
        </button>
      </div>

      {/* Secondary Fast Actions */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
        {/* Copy Image */}
        <button
          onClick={handleCopyImage}
          className="flex items-center justify-center space-x-1 sm:space-x-1.5 py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl text-[10px] sm:text-xs font-mono font-black bg-[#064423] text-white hover:bg-[#09572e] border-2 border-black pop-shadow transition cursor-pointer"
        >
          {copiedImage ? (
            <>
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFE600] shrink-0" />
              <span className="text-[#FFE600] truncate">Copied!</span>
            </>
          ) : (
            <>
              <FileImage className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFE600] shrink-0" />
              <span className="truncate">Copy Image</span>
            </>
          )}
        </button>

        {/* Copy Caption */}
        <button
          onClick={handleCopyCaption}
          className="flex items-center justify-center space-x-1 sm:space-x-1.5 py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl text-[10px] sm:text-xs font-mono font-black bg-[#064423] text-white hover:bg-[#09572e] border-2 border-black pop-shadow transition cursor-pointer"
        >
          {copiedCaption ? (
            <>
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4FF00] shrink-0" />
              <span className="text-[#D4FF00] truncate">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4FF00] shrink-0" />
              <span className="truncate">Post Text</span>
            </>
          )}
        </button>

        {/* How to Post Guide */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenHowTo();
          }}
          className="flex items-center justify-center space-x-1 sm:space-x-1.5 py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl text-[10px] sm:text-xs font-mono font-black bg-[#064423] text-[#FFE600] hover:bg-[#09572e] border-2 border-black pop-shadow transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF007A] shrink-0" />
          <span className="truncate">Guide</span>
        </button>
      </div>
    </div>
  );
};
