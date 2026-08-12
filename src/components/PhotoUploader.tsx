import React, { useRef, useState } from 'react';
import type { PhotoFilterId, PhotoTransform } from '../types';
import { PHOTO_FILTERS, generateSampleAvatarSvg } from '../utils/presets';
import { Upload, Image as ImageIcon, ZoomIn, Move, RotateCw, RefreshCw, Wand2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PhotoUploaderProps {
  photoUrl: string | null;
  setPhotoUrl: (url: string) => void;
  transform: PhotoTransform;
  setTransform: React.Dispatch<React.SetStateAction<PhotoTransform>>;
  name: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photoUrl,
  setPhotoUrl,
  transform,
  setTransform,
  name,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    soundManager.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoUrl(event.target.result as string);
        setTransform((prev) => ({ ...prev, panX: 0, panY: 0, zoom: 1, rotation: 0 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Drag and Drop Handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|webp|heic|heif|svg)$/i)) {
        processFile(file);
      }
    }
  };

  const handleSampleSelect = (hue: number, sampleName: string) => {
    soundManager.playClick();
    const svgUrl = generateSampleAvatarSvg(sampleName || name || 'HH', hue);
    setPhotoUrl(svgUrl);
    setTransform((prev) => ({ ...prev, panX: 0, panY: 0, zoom: 1, rotation: 0 }));
  };

  const resetTransform = () => {
    soundManager.playClick();
    setTransform({
      zoom: 1,
      panX: 0,
      panY: 0,
      rotation: 0,
      filter: 'normal',
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone & Quick Samples */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono font-black tracking-wider text-[#FFE600] flex items-center space-x-1.5">
            <ImageIcon className="w-4 h-4 text-[#FFE600]" />
            <span>BUILDER PHOTO / AVATAR</span>
          </label>
          {photoUrl && (
            <button
              onClick={resetTransform}
              className="text-xs font-mono text-slate-300 hover:text-[#FFE600] flex items-center space-x-1 transition cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Fit</span>
            </button>
          )}
        </div>

        {/* Drag / Click Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group cursor-pointer border-3 rounded-2xl p-5 text-center transition-all duration-150 pop-shadow ${
            isDragging
              ? 'border-[#FFE600] bg-[#0c7840] scale-[1.02] ring-4 ring-[#FFE600]/40'
              : 'border-dashed border-black bg-[#064423]/80 hover:bg-[#07522b]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,.heic,.heif"
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
            <div
              className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center pop-shadow transition-transform ${
                isDragging ? 'bg-[#FF007A] scale-110' : 'bg-[#FFE600] group-hover:scale-105'
              }`}
            >
              <Upload className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-sm font-black text-[#FFE600] group-hover:text-yellow-300 transition-colors">
                {isDragging
                  ? '✨ Drop your image file right here!'
                  : photoUrl
                  ? 'Drag & Drop or Click to Change Photo'
                  : 'Drag & Drop or Upload your Photo'}
              </p>
              <p className="text-xs text-slate-200 mt-0.5 font-mono">
                Works on portrait, landscape, selfie, iPhone HEIC · Auto-crop & fit
              </p>
            </div>
          </div>
        </div>

        {/* Quick Instant Avatars */}
        <div className="mt-3 flex items-center space-x-2">
          <span className="text-[11px] font-mono text-[#FFE600] flex items-center">
            <Wand2 className="w-3.5 h-3.5 mr-1 text-[#FF007A]" />
            Quick Presets:
          </span>
          <div className="flex items-center space-x-1.5 flex-wrap">
            {[
              { name: 'Goa Hacker', hue: 140 },
              { name: 'Beach Sun', hue: 45 },
              { name: 'Pink Retro', hue: 320 },
            ].map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => handleSampleSelect(s.hue, s.name)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#064423] hover:bg-[#FFE600] text-white hover:text-black border-2 border-black pop-shadow transition cursor-pointer"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Adjustments: Zoom, Pan, Rotation, Filter */}
      {photoUrl && (
        <div className="p-4 bg-[#064423] rounded-xl border-3 border-black pop-shadow space-y-3.5">
          {/* Zoom Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono font-bold text-white mb-1">
              <span className="flex items-center space-x-1">
                <ZoomIn className="w-3.5 h-3.5 text-[#FFE600]" />
                <span>Zoom Scale</span>
              </span>
              <span className="text-[#FFE600]">{Math.round(transform.zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={transform.zoom}
              onChange={(e) =>
                setTransform((prev) => ({ ...prev, zoom: parseFloat(e.target.value) }))
              }
              className="w-full cursor-pointer"
            />
          </div>

          {/* Pan Sliders */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-[11px] font-mono font-bold text-white mb-1">
                <span className="flex items-center space-x-1">
                  <Move className="w-3 h-3 text-[#FFE600]" />
                  <span>Pan X</span>
                </span>
                <span className="text-slate-300">{transform.panX}px</span>
              </div>
              <input
                type="range"
                min="-300"
                max="300"
                step="5"
                value={transform.panX}
                onChange={(e) =>
                  setTransform((prev) => ({ ...prev, panX: parseInt(e.target.value) }))
                }
                className="w-full cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono font-bold text-white mb-1">
                <span className="flex items-center space-x-1">
                  <Move className="w-3 h-3 text-[#FFE600]" />
                  <span>Pan Y</span>
                </span>
                <span className="text-slate-300">{transform.panY}px</span>
              </div>
              <input
                type="range"
                min="-300"
                max="300"
                step="5"
                value={transform.panY}
                onChange={(e) =>
                  setTransform((prev) => ({ ...prev, panY: parseInt(e.target.value) }))
                }
                className="w-full cursor-pointer"
              />
            </div>
          </div>

          {/* Rotate & Filters */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-bold text-white">Photo Tone</label>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setTransform((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
                }}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#FFE600] text-black border-2 border-black pop-shadow cursor-pointer"
              >
                <RotateCw className="w-3 h-3 text-black" />
                <span>Rotate 90°</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {PHOTO_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setTransform((prev) => ({ ...prev, filter: f.id as PhotoFilterId }));
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition text-center border-2 border-black cursor-pointer ${
                    transform.filter === f.id
                      ? 'bg-[#FF007A] text-white pop-shadow'
                      : 'bg-[#0a6c38] text-white hover:bg-[#0d8244]'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
