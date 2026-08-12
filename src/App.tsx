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
import { GoaBackground } from './components/GoaBackground';
import { soundManager } from './utils/audio';
import { ExternalLink } from 'lucide-react';
import './App.css';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mode, setMode] = useState<AppMode>('id_card');
  const [selectedPreset, setSelectedPreset] = useState<FramePreset>(FRAME_PRESETS[0]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isHowToOpen, setIsHowToOpen] = useState<boolean>(false);
  const [isCircularMask, setIsCircularMask] = useState<boolean>(false);

  // Single User State
  const [photoUrl, setPhotoUrl] = useState<string | null>(() =>
    generateSampleAvatarSvg('Hacker', 140)
  );
  const [transform, setTransform] = useState<PhotoTransform>({
    zoom: 1,
    panX: 0,
    panY: 0,
    rotation: 0,
    filter: 'normal',
  });

  const [profile, setProfile] = useState<BuilderProfile>({
    name: '',
    handle: '',
    role: '',
    customRole: '',
    techStack: [],
    builderClass: 'Coconut Kernel Dev',
    level: 'RESIDENT',
    idNumber: 'HH26-9842-GOA',
    motto: 'Heads Down · Ship or Ship',
  });

  // Team / Squad State
  const [team, setTeam] = useState<TeamProfile>({
    teamName: '',
    tagline: '',
    members: [
      {
        id: 'mem_1',
        name: '',
        handle: '',
        role: '',
        photoUrl: generateSampleAvatarSvg('Member 1', 140),
        transform: { zoom: 1, panX: 0, panY: 0, rotation: 0, filter: 'normal' },
      },
      {
        id: 'mem_2',
        name: '',
        handle: '',
        role: '',
        photoUrl: generateSampleAvatarSvg('Member 2', 45),
        transform: { zoom: 1, panX: 0, panY: 0, rotation: 0, filter: 'normal' },
      },
      {
        id: 'mem_3',
        name: '',
        handle: '',
        role: '',
        photoUrl: generateSampleAvatarSvg('Member 3', 320),
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

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen relative flex flex-col selection:bg-[#FFE600] selection:text-black w-full max-w-full transition-colors duration-300 ${
        isLight ? 'text-slate-900' : 'text-white'
      }`}
    >
      {/* Background with translucent Goa palm trees, beach atmosphere, and radiant central yellow sun effect */}
      <GoaBackground theme={theme} />

      {/* Top Navbar */}
      <Navbar
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenHowTo={() => setIsHowToOpen(true)}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
        {/* Authentic HH Goa Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-4 sm:mb-8 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#064423]/90 backdrop-blur-md text-white border-2 border-black pop-shadow text-[10px] sm:text-xs font-mono">
            <span className="text-[#FFE600] font-black">2:47 PM STUDIO</span>
            <span className="text-white">·</span>
            <span className="text-[#D4FF00] font-bold">GOA, INDIA · 28–31 OCT 2026</span>
          </div>

          {/* Big Iconic Logo Heading with warm center glow aura */}
          <div className="relative flex items-center justify-center space-x-1.5 sm:space-x-4 flex-wrap py-1 sm:py-2">
            <span
              className={`font-serif-hh font-black text-3xl sm:text-7xl tracking-tight transition-colors ${
                isLight ? 'text-[#064423] drop-shadow-sm' : 'text-[#FFE600] drop-shadow-md'
              }`}
            >
              HACKER
            </span>
            <span className="font-goa-hindi font-black text-2xl sm:text-6xl text-[#FF007A] bg-[#FFE600] px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border-2 sm:border-3 border-black pop-shadow transform -rotate-3 hover:rotate-0 transition">
              गोवा
            </span>
            <span
              className={`font-serif-hh font-black text-3xl sm:text-7xl tracking-tight transition-colors ${
                isLight ? 'text-[#064423] drop-shadow-sm' : 'text-[#FFE600] drop-shadow-md'
              }`}
            >
              HOUSE
            </span>
          </div>

          <p
            className={`text-xs sm:text-base font-medium max-w-2xl mx-auto px-2 ${
              isLight ? 'text-slate-800' : 'text-slate-100'
            }`}
          >
            Official <strong>Task #1 Shortlisting Generator</strong>. Create your authentic <strong>HH Goa 2026</strong> PFP Frame, Builder ID Card, or combined Squad Pass. 1-click Download & Share to X with{' '}
            <span className="text-[#064423] bg-[#FFE600] px-1.5 py-0.5 rounded font-mono font-black border border-black inline-block">
              #FrameInGoa
            </span>{' '}
            to get featured on the Radar!
          </p>
        </div>

        {/* Mode Selector (Format A, Format B, Team Pass) */}
        <ModeSelector mode={mode} setMode={setMode} />

        {/* Workspace: 2-column with sticky preview sliding down smoothly */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start w-full">
          {/* Card Preview & Action Toolbar (order-1 on mobile so it is right at top; order-2 / right column on laptop) */}
          <div className="order-1 lg:order-2 lg:col-span-6 lg:sticky lg:top-24 space-y-4 sm:space-y-6 w-full min-w-0">
            <div className="p-3.5 sm:p-5 bg-[#064423]/85 backdrop-blur-xl border-3 sm:border-4 border-black/90 rounded-2xl sm:rounded-3xl pop-shadow-lg w-full min-w-0">
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
          </div>

          {/* Customization Forms (order-2 on mobile right below preview; order-1 / left column on laptop) */}
          <div className="order-2 lg:order-1 lg:col-span-6 space-y-4 sm:space-y-6 w-full min-w-0 text-white">
            {/* Theme Preset Selector */}
            <div className="p-3.5 sm:p-5 bg-[#064423]/85 backdrop-blur-xl border-3 sm:border-4 border-black/90 rounded-2xl sm:rounded-3xl pop-shadow-lg w-full min-w-0">
              <PresetSelector
                selectedPreset={selectedPreset}
                onSelectPreset={setSelectedPreset}
              />
            </div>

            {/* Photo Upload & Adjustments */}
            {mode !== 'team_pass' && (
              <div className="p-3.5 sm:p-5 bg-[#064423]/85 backdrop-blur-xl border-3 sm:border-4 border-black/90 rounded-2xl sm:rounded-3xl pop-shadow-lg w-full min-w-0">
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
            <div className="p-3.5 sm:p-5 bg-[#064423]/85 backdrop-blur-xl border-3 sm:border-4 border-black/90 rounded-2xl sm:rounded-3xl pop-shadow-lg w-full min-w-0">
              {mode === 'team_pass' ? (
                <TeamForm team={team} setTeam={setTeam} />
              ) : (
                <BuilderForm profile={profile} setProfile={setProfile} />
              )}
            </div>
          </div>
        </div>

        {/* Unified Full-Width Directional Signpost Stats Strip (Ends at the exact same level across the entire page) */}
        <div className="w-full mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 p-3 sm:p-4 bg-[#064423]/85 backdrop-blur-xl border-3 sm:border-4 border-black/90 rounded-2xl sm:rounded-3xl pop-shadow-lg text-center">
          <div className="p-2 sm:p-3 bg-[#FFE600] text-black rounded-xl border-2 border-black pop-shadow hover:scale-[1.02] transition">
            <span className="font-serif-hh font-black text-lg sm:text-2xl block">6800+</span>
            <span className="text-[10px] sm:text-xs font-mono font-bold block text-slate-800">REGISTRATIONS</span>
          </div>

          <div className="p-2 sm:p-3 bg-[#FF007A] text-white rounded-xl border-2 border-black pop-shadow hover:scale-[1.02] transition">
            <span className="font-serif-hh font-black text-lg sm:text-2xl block">390+</span>
            <span className="text-[10px] sm:text-xs font-mono font-bold block text-slate-100">HACKERS</span>
          </div>

          <div className="p-2 sm:p-3 bg-[#FFE600] text-black rounded-xl border-2 border-black pop-shadow hover:scale-[1.02] transition">
            <span className="font-serif-hh font-black text-lg sm:text-2xl block">100</span>
            <span className="text-[10px] sm:text-xs font-mono font-bold block text-slate-800">PROJECTS</span>
          </div>

          <div className="p-2 sm:p-3 bg-[#FF007A] text-white rounded-xl border-2 border-black pop-shadow hover:scale-[1.02] transition">
            <span className="font-serif-hh font-black text-lg sm:text-2xl block">$50K+</span>
            <span className="text-[10px] sm:text-xs font-mono font-bold block text-slate-100">BOUNTIES '26</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-3 sm:border-t-4 border-black bg-[#064423]/90 backdrop-blur-md mt-10 sm:mt-16 py-6 sm:py-8 px-4 sm:px-8 text-slate-200 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="font-serif-hh font-black text-[#FFE600] text-sm sm:text-base">
              HACKER HOUSE GOA 2026
            </span>
            <span>·</span>
            <span className="text-[11px] sm:text-xs">2:47 PM Studio</span>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2">
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
              className="px-2.5 py-1 rounded bg-[#FF007A] text-white font-black border border-black hover:bg-pink-600 transition flex items-center space-x-1"
            >
              <span>Submit Task #1</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
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
