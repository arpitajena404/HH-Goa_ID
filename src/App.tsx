import { useState, useRef, useEffect } from 'react';
import type { AppMode, BuilderProfile, FramePreset, PhotoTransform, TeamProfile } from './types';
import { FRAME_PRESETS, generateSampleAvatarSvg, getRandomBuilderClass, generateRandomHashId } from './utils/presets';
import { Navbar } from './components/Navbar';
import { ModeSelector } from './components/ModeSelector';
import { PresetSelector } from './components/PresetSelector';
import { PhotoUploader } from './components/PhotoUploader';
import { BuilderForm } from './components/BuilderForm';
import { TeamForm } from './components/TeamForm';
import { CardPreview } from './components/CardPreview';
import { ActionToolbar } from './components/ActionToolbar';
import { HowToModal } from './components/HowToModal';
import { soundManager } from './utils/audio';
import { ExternalLink } from 'lucide-react';
import './App.css';

export function App() {
  const [mode, setMode] = useState<AppMode>('id_card');
  const [selectedPreset, setSelectedPreset] = useState<FramePreset>(FRAME_PRESETS[0]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isHowToOpen, setIsHowToOpen] = useState<boolean>(false);
  const [isCircularMask, setIsCircularMask] = useState<boolean>(false);

  // Single User State
  const [photoUrl, setPhotoUrl] = useState<string | null>(() =>
    generateSampleAvatarSvg('Satoshi Nomad', 140)
  );
  const [transform, setTransform] = useState<PhotoTransform>({
    zoom: 1,
    panX: 0,
    panY: 0,
    rotation: 0,
    filter: 'normal',
  });

  const [profile, setProfile] = useState<BuilderProfile>({
    name: 'Arpita Jena',
    handle: '@arpita_jena',
    role: 'Full-Stack Developer',
    customRole: '',
    techStack: ['Rust', 'Solana', 'AI / ML', 'TypeScript'],
    builderClass: 'Coconut Kernel Dev',
    level: 'RESIDENT',
    idNumber: 'HH26-9842-GOA',
    motto: 'Heads Down · Ship or Ship',
  });

  // Team / Squad State
  const [team, setTeam] = useState<TeamProfile>({
    teamName: 'The Goa Builders',
    tagline: 'Heads Down · Ship or Ship',
    members: [
      {
        id: 'mem_1',
        name: 'Arpita Jena',
        handle: '@arpita_jena',
        role: 'Protocol Lead',
        photoUrl: generateSampleAvatarSvg('Arpita', 140),
        transform: { zoom: 1, panX: 0, panY: 0, rotation: 0, filter: 'normal' },
      },
      {
        id: 'mem_2',
        name: 'Satoshi Nomad',
        handle: '@satoshinomad',
        role: 'AI Researcher',
        photoUrl: generateSampleAvatarSvg('Satoshi', 45),
        transform: { zoom: 1, panX: 0, panY: 0, rotation: 0, filter: 'normal' },
      },
      {
        id: 'mem_3',
        name: 'Vitalik Builder',
        handle: '@vbuilder',
        role: 'Systems Architect',
        photoUrl: generateSampleAvatarSvg('Vitalik', 320),
        transform: { zoom: 1, panX: 0, panY: 0, rotation: 0, filter: 'normal' },
      },
    ],
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const randomClass = getRandomBuilderClass();
    const randomId = generateRandomHashId();
    setProfile((prev) => ({
      ...prev,
      builderClass: randomClass,
      idNumber: randomId,
    }));

    // Start background music by default
    soundManager.startMusic();
    const unsubscribe = soundManager.subscribe(() => {
      setSoundEnabled(soundManager.getIsPlaying());
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-[#085830] text-white flex flex-col selection:bg-[#FFE600] selection:text-black">
      {/* Top Navbar */}
      <Navbar
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenHowTo={() => setIsHowToOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Authentic HH Goa Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#064423] border-2 border-black pop-shadow text-xs font-mono">
            <span className="text-[#FFE600] font-black">2:47 PM STUDIO</span>
            <span className="text-white">·</span>
            <span className="text-[#D4FF00] font-bold">GOA, INDIA · 28 – 31 OCT 2026</span>
          </div>

          {/* Big Iconic Logo Heading */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 flex-wrap py-2">
            <span className="font-serif-hh font-black text-4xl sm:text-7xl text-[#FFE600] tracking-tight drop-shadow-md">
              HACKER
            </span>
            <span className="font-goa-hindi font-black text-3xl sm:text-6xl text-[#FF007A] bg-[#FFE600] px-3 py-1 rounded-xl border-3 border-black pop-shadow transform -rotate-3 hover:rotate-0 transition">
              गोवा
            </span>
            <span className="font-serif-hh font-black text-4xl sm:text-7xl text-[#FFE600] tracking-tight drop-shadow-md">
              HOUSE
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-100 font-medium max-w-2xl mx-auto">
            Official <strong>Task #1 Shortlisting Generator</strong>. Create your authentic <strong>HH Goa 2026</strong> PFP Frame, Builder ID Card, or combined Squad Pass. 1-click Download & Share to X with <span className="text-[#FFE600] font-mono font-black underline decoration-2">#FrameInGoa</span> to get featured on the Radar!
          </p>
        </div>

        {/* Mode Selector (Format A, Format B, Team Pass) */}
        <ModeSelector mode={mode} setMode={setMode} />

        {/* Workspace 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Adjustments (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Theme Preset Selector */}
            <div className="p-5 bg-[#064423]/90 border-4 border-black rounded-3xl pop-shadow-lg">
              <PresetSelector
                selectedPreset={selectedPreset}
                onSelectPreset={setSelectedPreset}
              />
            </div>

            {/* Photo Upload & Adjustments */}
            {mode !== 'team_pass' && (
              <div className="p-5 bg-[#064423]/90 border-4 border-black rounded-3xl pop-shadow-lg">
                <PhotoUploader
                  photoUrl={photoUrl}
                  setPhotoUrl={setPhotoUrl}
                  transform={transform}
                  setTransform={setTransform}
                  name={profile.name}
                />
              </div>
            )}

            {/* Profile / Team Details */}
            <div className="p-5 bg-[#064423]/90 border-4 border-black rounded-3xl pop-shadow-lg">
              {mode === 'team_pass' ? (
                <TeamForm team={team} setTeam={setTeam} />
              ) : (
                <BuilderForm profile={profile} setProfile={setProfile} />
              )}
            </div>
          </div>

          {/* Right Column: Live Sticky 2K Canvas Preview & Actions (6 cols) */}
          <div className="lg:col-span-6 lg:sticky lg:top-20 space-y-6">
            <div className="p-5 bg-[#064423]/90 border-4 border-black rounded-3xl pop-shadow-lg">
              {/* Canvas Preview with 3D tilt */}
              <CardPreview
                mode={mode}
                photoUrl={photoUrl}
                transform={transform}
                preset={selectedPreset}
                profile={profile}
                team={team}
                isCircularMask={isCircularMask}
                setIsCircularMask={setIsCircularMask}
                canvasRef={canvasRef}
              />

              {/* Action Toolbar: Download, Share to X, Copy Image */}
              <ActionToolbar
                mode={mode}
                profile={profile}
                team={team}
                canvasRef={canvasRef}
                onOpenHowTo={() => setIsHowToOpen(true)}
              />
            </div>

            {/* Directional Signpost Stats Strip (Exactly matching HH Goa website stats!) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-[#064423] border-3 border-black rounded-2xl pop-shadow text-center">
              <div className="p-2 bg-[#FFE600] text-black rounded-xl border-2 border-black pop-shadow">
                <span className="font-serif-hh font-black text-lg sm:text-xl block">6800+</span>
                <span className="text-[10px] font-mono font-bold block text-slate-800">REGISTRATIONS</span>
              </div>

              <div className="p-2 bg-[#FF007A] text-white rounded-xl border-2 border-black pop-shadow">
                <span className="font-serif-hh font-black text-lg sm:text-xl block">390+</span>
                <span className="text-[10px] font-mono font-bold block text-slate-100">HACKERS</span>
              </div>

              <div className="p-2 bg-[#FFE600] text-black rounded-xl border-2 border-black pop-shadow">
                <span className="font-serif-hh font-black text-lg sm:text-xl block">100</span>
                <span className="text-[10px] font-mono font-bold block text-slate-800">PROJECTS</span>
              </div>

              <div className="p-2 bg-[#FF007A] text-white rounded-xl border-2 border-black pop-shadow">
                <span className="font-serif-hh font-black text-lg sm:text-xl block">$50K+</span>
                <span className="text-[10px] font-mono font-bold block text-slate-100">BOUNTIES '26</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-[#064423] mt-16 py-8 px-4 sm:px-8 text-slate-200 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-serif-hh font-black text-[#FFE600] text-base">
              HACKER HOUSE GOA 2026
            </span>
            <span>·</span>
            <span>Organized by 2:47 PM Studio</span>
          </div>

          <div className="flex items-center space-x-5">
            <a
              href="https://hhgoa.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFE600] hover:underline font-bold transition"
            >
              Official Website
            </a>
            <a
              href="https://x.com/247pmstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFE600] hover:underline font-bold transition"
            >
              @247pmstudio on X
            </a>
            <a
              href="https://hacker-house-goa-2026.devfolio.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFE600] hover:underline font-bold transition"
            >
              Devfolio
            </a>
            <a
              href="https://forms.gle/jM5hTaGvsrfEfixPA"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded bg-[#FF007A] text-white font-black border border-black hover:bg-pink-600 transition flex items-center space-x-1"
            >
              <span>Submit Task #1</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </footer>

      {/* How To Submission Modal */}
      <HowToModal
        isOpen={isHowToOpen}
        onClose={() => setIsHowToOpen(false)}
      />
    </div>
  );
}

export default App;
