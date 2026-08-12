export type AppMode = 'pfp' | 'id_card' | 'team_pass';

export type FramePresetId = 'hh_emerald' | 'beach_sunset' | 'pink_shack' | 'monsoon_lush' | 'retro_gold';

export interface FramePreset {
  id: FramePresetId;
  name: string;
  subtitle: string;
  themeColor: string; // e.g. Sunshine Yellow
  accentColor: string; // e.g. Hot Pink
  bgGreen: string; // e.g. Emerald Green
  textColor: string;
}

export type PhotoFilterId = 'normal' | 'goa_warm' | 'tropical_pop' | 'vintage_kodak' | 'mono_beach';

export interface PhotoFilter {
  id: PhotoFilterId;
  name: string;
  cssFilter: string;
}

export interface PhotoTransform {
  zoom: number;
  panX: number;
  panY: number;
  rotation: number;
  filter: PhotoFilterId;
}

export interface BuilderProfile {
  name: string;
  handle: string;
  role: string;
  customRole: string;
  techStack: string[];
  builderClass: string;
  level: string;
  idNumber: string;
  motto: string;
}

export interface TeamMember {
  id: string;
  name: string;
  handle: string;
  role: string;
  photoUrl: string | null;
  transform: PhotoTransform;
}

export interface TeamProfile {
  teamName: string;
  tagline: string;
  members: TeamMember[];
}
