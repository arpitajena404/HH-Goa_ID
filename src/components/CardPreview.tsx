import React, { useRef, useEffect, useState } from 'react';
import type { AppMode, BuilderProfile, FramePreset, PhotoTransform, TeamProfile } from '../types';
import {
  renderPfpCanvas,
  renderIdCardCanvas,
  renderTeamPassCanvas,
} from '../utils/canvasRenderer';
import { Circle, Square, RefreshCw, Eye } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CardPreviewProps {
  mode: AppMode;
  photoUrl: string | null;
  transform: PhotoTransform;
  preset: FramePreset;
  profile: BuilderProfile;
  team: TeamProfile;
  isCircularMask: boolean;
  setIsCircularMask: (val: boolean) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  mode,
  photoUrl,
  transform,
  preset,
  profile,
  team,
  isCircularMask,
  setIsCircularMask,
  canvasRef,
}) => {
  const [isRendering, setIsRendering] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });

  useEffect(() => {
    let isCancelled = false;
    const render = async () => {
      if (!canvasRef.current) return;
      setIsRendering(true);

      try {
        if (mode === 'pfp') {
          await renderPfpCanvas(
            canvasRef.current,
            photoUrl,
            transform,
            preset,
            profile,
            isCircularMask
          );
        } else if (mode === 'id_card') {
          await renderIdCardCanvas(
            canvasRef.current,
            photoUrl,
            transform,
            preset,
            profile
          );
        } else if (mode === 'team_pass') {
          await renderTeamPassCanvas(
            canvasRef.current,
            team,
            preset
          );
        }
      } catch (err) {
        console.error('Canvas render error:', err);
      } finally {
        if (!isCancelled) setIsRendering(false);
      }
    };

    render();

    return () => {
      isCancelled = true;
    };
  }, [mode, photoUrl, transform, preset, profile, team, isCircularMask]);

  // 3D Tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      glareX,
      glareY,
      glareOpacity: 0.12,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Top Preview Controls */}
      <div className="w-full flex items-center justify-between mb-2 sm:mb-3 px-0.5 sm:px-1">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-mono font-black bg-[#FFE600] text-black border-2 border-black pop-shadow">
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
            <span>LIVE 2K HD</span>
          </span>
          {isRendering && (
            <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFE600] animate-spin" />
          )}
        </div>

        {/* PFP Shape Toggle */}
        {mode === 'pfp' && (
          <div className="flex items-center space-x-1 sm:space-x-1.5 p-0.5 sm:p-1 bg-[#064423] rounded-xl border-2 border-black pop-shadow">
            <button
              onClick={() => {
                soundManager.playClick();
                setIsCircularMask(false);
              }}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg flex items-center space-x-1 text-[10px] sm:text-xs font-mono font-bold transition cursor-pointer ${
                !isCircularMask
                  ? 'bg-[#FFE600] text-black border border-black'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Square Frame"
            >
              <Square className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Square</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setIsCircularMask(true);
              }}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg flex items-center space-x-1 text-[10px] sm:text-xs font-mono font-bold transition cursor-pointer ${
                isCircularMask
                  ? 'bg-[#FFE600] text-black border border-black'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Circular Avatar"
            >
              <Circle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Circle</span>
            </button>
          </div>
        )}
      </div>

      {/* 3D Tilt Wrapper */}
      <div
        ref={cardContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative group cursor-crosshair w-full flex items-center justify-center p-1 sm:p-2 rounded-2xl transition-transform duration-100"
      >
        <div
          className="relative rounded-2xl overflow-hidden pop-shadow-lg transition-all duration-150 border-3 sm:border-4 border-black bg-[#064423]"
          style={{
            transform: tiltStyle.transform,
          }}
        >
          {/* Main Canvas */}
          <canvas
            ref={canvasRef}
            className={`block max-h-[380px] sm:max-h-[560px] max-w-full object-contain ${
              isCircularMask && mode === 'pfp' ? 'rounded-full' : 'rounded-xl'
            }`}
          />

          {/* Glare Sheen */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-200"
            style={{
              opacity: tiltStyle.glareOpacity,
              background: `radial-gradient(circle at ${tiltStyle.glareX}% ${tiltStyle.glareY}%, rgba(255,230,0,0.6) 0%, rgba(255,0,122,0.3) 40%, transparent 80%)`,
            }}
          />
        </div>
      </div>


    </div>
  );
};
