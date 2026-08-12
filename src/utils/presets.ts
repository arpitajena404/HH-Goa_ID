import type { FramePreset, PhotoFilter } from '../types';

export const FRAME_PRESETS: FramePreset[] = [
  {
    id: 'hh_emerald',
    name: 'HH Goa Official',
    subtitle: 'Emerald Green · Yellow · Hot Pink',
    themeColor: '#FFE600', // Sunshine Yellow
    accentColor: '#FF007A', // Goa Hot Pink
    bgGreen: '#0a6c38', // Iconic HH Goa Green
    textColor: '#FFFFFF',
  },
  {
    id: 'beach_sunset',
    name: 'Goa Sunset',
    subtitle: 'Golden Sun · Beach Amber',
    themeColor: '#FFDF00',
    accentColor: '#FF5E00',
    bgGreen: '#074828',
    textColor: '#FFFFFF',
  },
  {
    id: 'pink_shack',
    name: 'Beach Shack Pop',
    subtitle: 'Hot Magenta · Yellow Sign',
    themeColor: '#FFE600',
    accentColor: '#FF007A',
    bgGreen: '#0e552f',
    textColor: '#FFFFFF',
  },
  {
    id: 'monsoon_lush',
    name: 'Monsoon Palms',
    subtitle: 'Lush Green · Acid Lime',
    themeColor: '#D4FF00',
    accentColor: '#FFE600',
    bgGreen: '#064222',
    textColor: '#FFFFFF',
  },
  {
    id: 'retro_gold',
    name: 'Vintage Signpost',
    subtitle: 'Warm Ochre · Palm Noir',
    themeColor: '#FFD700',
    accentColor: '#FF1493',
    bgGreen: '#0b5a30',
    textColor: '#FFFFFF',
  },
];

export const PHOTO_FILTERS: PhotoFilter[] = [
  { id: 'normal', name: 'Raw / Crisp', cssFilter: 'none' },
  { id: 'goa_warm', name: 'Goa Sun Warmth', cssFilter: 'sepia(0.2) saturate(1.4) contrast(1.1) brightness(1.05)' },
  { id: 'tropical_pop', name: 'Tropical Pop', cssFilter: 'contrast(1.2) saturate(1.5) hue-rotate(-5deg)' },
  { id: 'vintage_kodak', name: 'Vintage 90s', cssFilter: 'contrast(1.15) brightness(1.05) saturate(1.2) sepia(0.15)' },
  { id: 'mono_beach', name: 'Monochrome', cssFilter: 'grayscale(1) contrast(1.3) brightness(0.95)' },
];

export const BUILDER_CLASSES = [
  'Coconut Kernel Dev',
  'Beachside AI Alchemist',
  'Chai & Code Nomad',
  '0xSolana Surfer',
  'Shack Protocol Architect',
  'Goa Beachside Hacker',
  'Sunset State Machine',
  'Neural Palm Engineer',
  'Zero-Knowledge Vagabond',
  'Full-Stack Voyager',
  'Bytecode Brewmaster',
  'Autonomous Agent Wrangler',
  'Consensus Crusader',
  'Vector Samurai',
  'Liquidity Vanguard',
];

export const ROLE_PRESETS = [
  'Full-Stack Developer',
  'AI / ML Engineer',
  'Smart Contract Engineer',
  'Rust / Systems Dev',
  'Product Architect',
  'UI / UX Designer',
  'Founding Engineer',
  'Autonomous Agent Dev',
];

export const TECH_STACK_TAGS = [
  'Rust',
  'Solana',
  'TypeScript',
  'Next.js',
  'PyTorch',
  'EVM / Solidity',
  'LangChain',
  'Move / Aptos',
  'Zero-Knowledge',
  'Go',
  'Python',
  'TailwindCSS',
  'GraphQL',
  'PostgreSQL',
];

export function getRandomBuilderClass(): string {
  const index = Math.floor(Math.random() * BUILDER_CLASSES.length);
  return BUILDER_CLASSES[index];
}

export function generateRandomHashId(): string {
  const chars = '0123456789ABCDEF';
  let hash = '';
  for (let i = 0; i < 4; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return `HH26-${hash}-GOA`;
}

// Generate high quality sample avatar SVG with Goa Beach vibe
export function generateSampleAvatarSvg(name: string, bgHue: number = 140): string {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'HH';

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="hsl(${bgHue}, 70%, 25%)" />
        <stop offset="60%" stop-color="hsl(${bgHue}, 60%, 35%)" />
        <stop offset="100%" stop-color="hsl(${bgHue}, 80%, 15%)" />
      </linearGradient>
    </defs>
    
    <!-- Background -->
    <rect width="600" height="600" fill="url(#skyGrad)" />
    
    <!-- Golden Beach Sun -->
    <circle cx="300" cy="220" r="130" fill="#FFE600" />
    <path d="M 300 60 L 300 30 M 300 380 L 300 410 M 140 220 L 110 220 M 460 220 L 490 220 M 180 100 L 160 80 M 420 100 L 440 80" stroke="#FFE600" stroke-width="6" stroke-linecap="round" />

    <!-- Palm Trees on Sides -->
    <g stroke="#042e16" stroke-width="8" stroke-linecap="round" fill="none">
      <path d="M 60 500 Q 90 320 80 180" />
      <path d="M 80 180 Q 20 150 0 190" fill="#042e16" />
      <path d="M 80 180 Q 110 120 150 140" fill="#042e16" />
      <path d="M 80 180 Q 50 110 80 80" fill="#042e16" />

      <path d="M 540 500 Q 510 320 520 180" />
      <path d="M 520 180 Q 580 150 600 190" fill="#042e16" />
      <path d="M 520 180 Q 490 120 450 140" fill="#042e16" />
    </g>

    <!-- White Sand Hill -->
    <path d="M 0 440 Q 300 380 600 440 L 600 600 L 0 600 Z" fill="#FFFFFF" />

    <!-- Hacker Silhouette with Sunglasses -->
    <g transform="translate(300, 350)">
      <!-- Head -->
      <circle cx="0" cy="-20" r="60" fill="#FFE600" stroke="#000000" stroke-width="6" />
      <!-- Retro Goa Sunglasses -->
      <rect x="-42" y="-32" width="38" height="24" rx="6" fill="#FF007A" stroke="#000000" stroke-width="4" />
      <rect x="4" y="-32" width="38" height="24" rx="6" fill="#FF007A" stroke="#000000" stroke-width="4" />
      <line x1="-4" y1="-20" x2="4" y2="-20" stroke="#000000" stroke-width="4" />
      <!-- Smile -->
      <path d="M -20 10 Q 0 25 20 10" stroke="#000000" stroke-width="5" stroke-linecap="round" fill="none" />
      <!-- Shirt -->
      <path d="M -110 140 C -100 60, -60 40, 0 40 C 60 40, 100 60, 110 140 Z" fill="#0a6c38" stroke="#000000" stroke-width="6" />
    </g>

    <!-- Initials Badge in Yellow Sign -->
    <rect x="220" y="490" width="160" height="48" rx="10" fill="#FFE600" stroke="#000000" stroke-width="5"/>
    <text x="300" y="523" font-family="'Space Grotesk', sans-serif" font-size="24" font-weight="900" fill="#000000" text-anchor="middle" letter-spacing="3">${initials} · GOA '26</text>
  </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
