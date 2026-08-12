import QRCode from 'qrcode';
import type { BuilderProfile, FramePreset, PhotoFilterId, PhotoTransform, TeamProfile } from '../types';

// Helper to load image
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

// Generate QR Code data URL with HH Goa styling
export async function generateQrDataUrl(text: string, dark = '#000000', light = '#FFE600'): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 256,
      color: {
        dark: dark,
        light: light,
      },
    });
  } catch {
    return '';
  }
}

// Apply photo filter to canvas context
function applyCanvasFilter(ctx: CanvasRenderingContext2D, filter: PhotoFilterId) {
  switch (filter) {
    case 'goa_warm':
      ctx.filter = 'sepia(0.2) saturate(1.4) contrast(1.1) brightness(1.05)';
      break;
    case 'tropical_pop':
      ctx.filter = 'contrast(1.2) saturate(1.5) hue-rotate(-5deg)';
      break;
    case 'vintage_kodak':
      ctx.filter = 'contrast(1.15) brightness(1.05) saturate(1.2) sepia(0.15)';
      break;
    case 'mono_beach':
      ctx.filter = 'grayscale(100%) contrast(1.3) brightness(0.95)';
      break;
    case 'normal':
    default:
      ctx.filter = 'none';
      break;
  }
}

// Draw transformed user image
function drawTransformedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  transform: PhotoTransform,
  isCircle: boolean = false
) {
  ctx.save();

  // Clipping path
  ctx.beginPath();
  if (isCircle) {
    ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.clip();

  // Background fill behind image
  ctx.fillStyle = '#06381e';
  ctx.fillRect(x, y, w, h);

  applyCanvasFilter(ctx, transform.filter);

  const cx = x + w / 2;
  const cy = y + h / 2;

  ctx.translate(cx + transform.panX, cy + transform.panY);
  ctx.rotate((transform.rotation * Math.PI) / 180);

  const imgAspect = img.width / img.height;
  const targetAspect = w / h;
  let drawW = w;
  let drawH = h;

  if (imgAspect > targetAspect) {
    drawH = h;
    drawW = h * imgAspect;
  } else {
    drawW = w;
    drawH = w / imgAspect;
  }

  drawW *= transform.zoom;
  drawH *= transform.zoom;

  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
}

/* ========================================================
   1. FORMAT A: PFP FRAME RENDERER (2048 x 2048 Square)
   ======================================================== */
export async function renderPfpCanvas(
  canvas: HTMLCanvasElement,
  photoUrl: string | null,
  transform: PhotoTransform,
  preset: FramePreset,
  profile: BuilderProfile,
  isCircularMask: boolean = false
) {
  const size = 2048;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Background: Deep Emerald Green
  ctx.fillStyle = preset.bgGreen || '#0a6c38';
  ctx.fillRect(0, 0, size, size);

  // Background Goa beach scenery & palm trees
  drawRichGoaBeachBackground(ctx, size, size);

  const pad = isCircularMask ? 190 : 170;
  const photoSize = size - pad * 2;

  // 2. Draw User Photo
  if (photoUrl) {
    try {
      const img = await loadImage(photoUrl);
      drawTransformedImage(ctx, img, pad, pad, photoSize, photoSize, transform, isCircularMask);
    } catch (e) {
      console.error('Failed to load image in PFP canvas', e);
    }
  }

  ctx.save();

  if (isCircularMask) {
    const cx = size / 2;
    const cy = size / 2;
    const radius = photoSize / 2;

    // Outer Thick Yellow & Black Pop Ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFE600';
    ctx.lineWidth = 24;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + 14, 0, Math.PI * 2);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius - 14, 0, Math.PI * 2);
    ctx.strokeStyle = '#FF007A';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Top Header: "HACKER HOUSE" + "गोवा"
    drawHackerHouseLogo(ctx, cx, 140, 0.7);

    // Bottom Badge: Builder Class & #FrameInGoa
    const badgeY = size - 140;
    drawPopSignBadge(ctx, cx, badgeY, 780, 90, '#FFE600', '#000000', [
      { text: `⚡ ${profile.builderClass.toUpperCase()} ⚡`, font: '900 30px "Space Grotesk", sans-serif', color: '#000000', yOffset: -8 },
      { text: '#FrameInGoa · HH GOA 2026', font: '800 22px "JetBrains Mono", monospace', color: '#FF007A', yOffset: 26 },
    ]);
  } else {
    // Square Frame Overlay with Comic Black Borders & Yellow/Pink accents
    // Outer Thick Frame
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#FFE600';
    ctx.strokeRect(pad, pad, photoSize, photoSize);

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(pad - 10, pad - 10, photoSize + 20, photoSize + 20);

    // Top Banner Bar
    const topBarH = 170;
    ctx.fillStyle = '#0a6c38';
    ctx.fillRect(pad, pad, photoSize, topBarH);
    ctx.fillStyle = '#000000';
    ctx.fillRect(pad, pad + topBarH - 6, photoSize, 6);

    // Top Header: 2:47 PM Studio + HACKER HOUSE + गोवा
    ctx.font = '800 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFE600';
    ctx.textAlign = 'left';
    ctx.fillText('2:47 PM STUDIO', pad + 35, pad + 45);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#D4FF00';
    ctx.fillText('GOA, INDIA · 28-31 OCT 2026', pad + photoSize - 35, pad + 45);

    drawHackerHouseLogo(ctx, pad + photoSize / 2, pad + 115, 0.65);

    // Bottom Banner Bar
    const bottomBarH = 190;
    const bottomBarY = pad + photoSize - bottomBarH;
    ctx.fillStyle = '#0a6c38';
    ctx.fillRect(pad, bottomBarY, photoSize, bottomBarH);
    ctx.fillStyle = '#000000';
    ctx.fillRect(pad, bottomBarY, photoSize, 6);

    // User Name
    ctx.textAlign = 'left';
    ctx.font = '900 48px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText((profile.name || 'HACKER BUILDER').toUpperCase(), pad + 35, bottomBarY + 65);

    // Builder Class
    ctx.font = '800 26px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFE600';
    ctx.fillText(`⚡ ${profile.builderClass || 'Coconut Kernel Dev'}`, pad + 35, bottomBarY + 115);

    // Tech Stack
    ctx.font = '700 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#BEF264';
    const stackStr = profile.techStack.length ? profile.techStack.join(' • ') : 'RUST • SOLANA • AI • MOVE';
    ctx.fillText(stackStr, pad + 35, bottomBarY + 155);

    // Right side: #FrameInGoa Hot Pink Stamp
    drawGoaStamp(ctx, pad + photoSize - 180, bottomBarY + 95, '#FF007A', '#FFE600');
  }

  ctx.restore();
}

/* ========================================================
   2. FORMAT B: BUILDER ID CARD / RESIDENT PASS (1200 x 1800)
   ======================================================== */
export async function renderIdCardCanvas(
  canvas: HTMLCanvasElement,
  photoUrl: string | null,
  transform: PhotoTransform,
  preset: FramePreset,
  profile: BuilderProfile
) {
  const W = 1200;
  const H = 1800;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Background: Outer Frame Background
  ctx.fillStyle = '#052a16';
  ctx.fillRect(0, 0, W, H);

  // Card Outer Dimensions
  const cx = 50;
  const cy = 50;
  const cw = W - 100;
  const ch = H - 100;
  const r = 28;

  ctx.save();
  // Card Shadow & Body (Neo-brutalist Pop style with bold shadow)
  ctx.fillStyle = '#000000';
  roundRect(ctx, cx + 12, cy + 12, cw, ch, r);
  ctx.fill();

  roundRect(ctx, cx, cy, cw, ch, r);
  ctx.fillStyle = preset.bgGreen || '#0a6c38';
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.clip();

  // Background Sunburst, Ocean Waves & Beach Palm Trees
  drawRichGoaBeachBackground(ctx, W, H);

  // Top Lanyard Punch Slot
  drawLanyardSlot(ctx, W / 2, cy + 25);

  // 2. Top Header Section: 2:47 PM STUDIO + HACKER HOUSE + गोवा
  const headerY = cy + 70;

  // "2:47 PM STUDIO"
  ctx.font = '800 24px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FFE600';
  ctx.textAlign = 'center';
  ctx.fillText('2:47 PM STUDIO', W / 2, headerY + 25);

  // Iconic "HACKER HOUSE" + "गोवा" Logo
  drawHackerHouseLogo(ctx, W / 2, headerY + 115, 0.85);

  // Date & Location Banner
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillStyle = '#BEF264';
  ctx.fillText('GOA, INDIA  ·  28 – 31 OCT 2026', W / 2, headerY + 180);

  // 3. Center Photo Section
  const photoW = 440;
  const photoH = 470;
  const photoX = W / 2 - photoW / 2;
  const photoY = headerY + 195;

  // Beach Props flanking the photo (Umbrella & Surfboard on Left, Fresh Coconut Drink on Right)
  drawGoaBeachUmbrellaAndSurfboard(ctx, photoX - 60, photoY + photoH - 20, 1.0);
  drawGoaCoconutDrink(ctx, photoX + photoW + 55, photoY + photoH - 25, 1.0);

  // Photo Box Comic Shadow & Border
  ctx.fillStyle = '#000000';
  roundRect(ctx, photoX + 10, photoY + 10, photoW, photoH, 16);
  ctx.fill();

  // Photo
  if (photoUrl) {
    try {
      const img = await loadImage(photoUrl);
      ctx.save();
      roundRect(ctx, photoX, photoY, photoW, photoH, 16);
      ctx.clip();
      drawTransformedImage(ctx, img, photoX, photoY, photoW, photoH, transform, false);
      ctx.restore();
    } catch (e) {
      console.error('Failed to load image in ID Card canvas', e);
    }
  }

  // Photo Border
  roundRect(ctx, photoX, photoY, photoW, photoH, 16);
  ctx.strokeStyle = '#FFE600';
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.stroke();

  // "RESIDENT BUILDER" Hot Pink Ribbon Badge on Photo Bottom
  const ribbonY = photoY + photoH - 24;
  drawPopSignBadge(ctx, W / 2, ribbonY, 340, 48, '#FF007A', '#000000', [
    { text: '★ RESIDENT BUILDER PASS ★', font: '900 18px "Space Grotesk", sans-serif', color: '#FFFFFF', yOffset: 6 },
  ]);

  // 4. Builder Name & Handle
  const nameY = photoY + photoH + 68;
  ctx.font = '900 50px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText((profile.name || 'ANON BUILDER').toUpperCase(), W / 2, nameY);

  if (profile.handle) {
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFE600';
    const hText = profile.handle.startsWith('@') ? profile.handle : `@${profile.handle}`;
    ctx.fillText(hText, W / 2, nameY + 34);
  }

  // 5. Directional Arrow Signposts for Builder Class & Role (with clear spacing after handle)
  const signpostStartY = profile.handle ? nameY + 98 : nameY + 68;

  // Signpost 1: Yellow Arrow - Builder Class
  drawDirectionalArrowSign(
    ctx,
    W / 2,
    signpostStartY,
    740,
    58,
    'right',
    '#FFE600',
    '#000000',
    `⚡ ${profile.builderClass || 'Coconut Kernel Dev'} ⚡`,
    '900 24px "Space Grotesk", sans-serif'
  );

  // Signpost 2: Hot Pink Arrow - Primary Role (Accepts any custom typed role!)
  const displayRole = profile.role || 'Full-Stack Developer';
  drawDirectionalArrowSign(
    ctx,
    W / 2,
    signpostStartY + 68,
    680,
    52,
    'left',
    '#FF007A',
    '#FFFFFF',
    `ROLE: ${displayRole.toUpperCase()}`,
    '800 20px "JetBrains Mono", monospace'
  );

  // Tech Stack Pills (Yellow / Lime) - Renders the exact user-typed & selected tags!
  const stackY = signpostStartY + 140;
  const tags = profile.techStack.length ? profile.techStack : ['Rust', 'Solana', 'AI / ML', 'TypeScript'];
  drawPopTags(ctx, W / 2, stackY, tags);

  // 6. Bottom Footer: QR Code, ID Number, #FrameInGoa
  const footY = H - 220;
  const qrSize = 135;
  const qrX = cx + 70;

  // QR code box with shadow
  ctx.fillStyle = '#000000';
  ctx.fillRect(qrX + 6, footY + 6, qrSize, qrSize);

  try {
    const qrLink = 'https://hhgoa.com/';
    const qrDataUrl = await generateQrDataUrl(qrLink, '#000000', '#FFE600');
    if (qrDataUrl) {
      const qrImg = await loadImage(qrDataUrl);
      ctx.drawImage(qrImg, qrX, footY, qrSize, qrSize);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeRect(qrX, footY, qrSize, qrSize);
    }
  } catch (e) {
    console.error('Failed to generate QR code in ID card', e);
  }

  // Right side of Bottom: Verified Resident Details & Hashtag
  const metaX = qrX + qrSize + 40;
  ctx.textAlign = 'left';

  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#FFE600';
  ctx.fillText('VERIFIED RESIDENT', metaX, footY + 35);

  ctx.font = '800 24px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`ID: ${profile.idNumber || 'HH26-9842-GOA'}`, metaX, footY + 70);

  ctx.font = '900 26px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#FF007A';
  ctx.fillText('#FrameInGoa', metaX, footY + 105);

  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#BEF264';
  ctx.fillText('HEADS DOWN · SHIP OR SHIP', metaX, footY + 130);

  // Retro Goa Scooter with Boy Driving & Girl with Laptop on Pillion (centered in the gap!)
  drawGoaScooterHackerDuo(ctx, cx + cw - 420, footY + 155, 0.90);

  // Authentic Goan Villa / House peeking in the bottom-right corner (matching hhgoa.com art!)
  drawGoanHouseCorner(ctx, cx + cw - 70, footY + 160, 1.0);

  // Outer border stroke
  roundRect(ctx, cx, cy, cw, ch, r);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.restore();
}

/* ========================================================
   3. FORMAT C: TEAM PASS / SQUAD FRAME (1800 x 1200 Landscape)
   ======================================================== */
export async function renderTeamPassCanvas(
  canvas: HTMLCanvasElement,
  team: TeamProfile,
  preset: FramePreset
) {
  const W = 1800;
  const H = 1200;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Outer background
  ctx.fillStyle = '#052a16';
  ctx.fillRect(0, 0, W, H);

  const cx = 45;
  const cy = 45;
  const cw = W - 90;
  const ch = H - 90;
  const r = 28;

  ctx.save();
  // Outer Pop Shadow & Card Base
  ctx.fillStyle = '#000000';
  roundRect(ctx, cx + 12, cy + 12, cw, ch, r);
  ctx.fill();

  roundRect(ctx, cx, cy, cw, ch, r);
  ctx.fillStyle = preset.bgGreen || '#0a6c38';
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.clip();

  // Rich Beach Background
  drawRichGoaBeachBackground(ctx, W, H);

  // 1. Top Header: 2:47 PM Studio + Centered HACKER HOUSE Goa Logo
  const topMetaY = cy + 30;
  ctx.font = '800 20px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FFE600';
  ctx.textAlign = 'center';
  ctx.fillText('2:47 PM STUDIO  ·  GOA, INDIA  ·  28 – 31 OCT 2026', W / 2, topMetaY);

  // Centered Iconic "HACKER HOUSE" + "गोवा" Logo
  drawHackerHouseLogo(ctx, W / 2, topMetaY + 65, 0.78);

  // 2. Squad Name Signpost Banner (Clean, distinct, no overlapping)
  const squadSignY = topMetaY + 130;
  const squadSignW = Math.min(1100, cw - 200);
  const squadSignH = 54;

  // Signpost Shadow & Body
  ctx.fillStyle = '#000000';
  roundRect(ctx, W / 2 - squadSignW / 2 + 6, squadSignY - squadSignH / 2 + 6, squadSignW, squadSignH, 12);
  ctx.fill();

  roundRect(ctx, W / 2 - squadSignW / 2, squadSignY - squadSignH / 2, squadSignW, squadSignH, 12);
  ctx.fillStyle = '#FFE600';
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Squad Title text
  ctx.font = '900 26px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  const squadTitle = `⚡ SQUAD: ${(team.teamName || 'THE GOA BUILDERS').toUpperCase()} ⚡`;
  ctx.fillText(squadTitle, W / 2, squadSignY + 8);

  // Tagline below signpost
  if (team.tagline) {
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#BEF264';
    ctx.fillText(`"${team.tagline}"`, W / 2, squadSignY + 44);
  }

  // 3. Bamboo Hanging Beam
  const beamY = squadSignY + 70;
  drawBambooBeam(ctx, cx + 40, beamY, cw - 80);

  // 4. Teammates Hanging Board Cards Area
  const memberCount = Math.min(team.members.length, 4);
  const cardAreaY = beamY + 30;
  const cardAreaH = 680;
  const gap = 26;
  const availW = cw - 100;
  const cardW = (availW - (memberCount - 1) * gap) / memberCount;
  const startX = cx + 50;

  for (let i = 0; i < memberCount; i++) {
    const m = team.members[i];
    const mx = startX + i * (cardW + gap);
    const my = cardAreaY;

    // Hanging cords from bamboo beam
    ctx.strokeStyle = '#FFE600';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(mx + 35, beamY + 10);
    ctx.lineTo(mx + 35, my);
    ctx.moveTo(mx + cardW - 35, beamY + 10);
    ctx.lineTo(mx + cardW - 35, my);
    ctx.stroke();

    // Member Card Theme (Alternating Sunshine Yellow & Hot Pink)
    const isYellow = i % 2 === 0;
    const cardBg = isYellow ? '#FFE600' : '#FF007A';
    const cardTextCol = isYellow ? '#000000' : '#FFFFFF';

    ctx.save();
    // Shadow
    ctx.fillStyle = '#000000';
    roundRect(ctx, mx + 8, my + 8, cardW, cardAreaH, 16);
    ctx.fill();

    roundRect(ctx, mx, my, cardW, cardAreaH, 16);
    ctx.fillStyle = cardBg;
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.clip();

    // Member Header (e.g. MEMBER 01)
    ctx.font = '900 18px "JetBrains Mono", monospace';
    ctx.fillStyle = cardTextCol;
    ctx.textAlign = 'center';
    ctx.fillText(`★ MEMBER 0${i + 1} ★`, mx + cardW / 2, my + 32);

    // Member Photo Area
    const photoH = 360;
    const photoW = cardW - 30;
    const px = mx + 15;
    const py = my + 46;

    // Photo Box Background
    ctx.fillStyle = '#000000';
    roundRect(ctx, px + 4, py + 4, photoW, photoH, 12);
    ctx.fill();

    if (m.photoUrl) {
      try {
        const img = await loadImage(m.photoUrl);
        ctx.save();
        roundRect(ctx, px, py, photoW, photoH, 12);
        ctx.clip();
        drawTransformedImage(ctx, img, px, py, photoW, photoH, m.transform, false);
        ctx.restore();
      } catch (e) {
        console.error('Failed to load member photo', e);
      }
    }

    // Photo Border
    roundRect(ctx, px, py, photoW, photoH, 12);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Member Name & Handle
    const textY = py + photoH + 42;
    ctx.textAlign = 'center';
    ctx.font = '900 28px "Space Grotesk", sans-serif';
    ctx.fillStyle = cardTextCol;
    ctx.fillText((m.name || `BUILDER ${i + 1}`).toUpperCase(), mx + cardW / 2, textY);

    if (m.handle) {
      ctx.font = '700 18px "JetBrains Mono", monospace';
      ctx.fillStyle = isYellow ? '#0a6c38' : '#FFE600';
      const hText = m.handle.startsWith('@') ? m.handle : `@${m.handle}`;
      ctx.fillText(hText, mx + cardW / 2, textY + 28);
    }

    // Role Pill Badge
    const roleTagY = textY + 68;
    const roleW = cardW - 36;
    const roleH = 40;
    ctx.fillStyle = '#000000';
    roundRect(ctx, mx + 18 + 3, roleTagY - roleH / 2 + 3, roleW, roleH, 8);
    ctx.fill();

    roundRect(ctx, mx + 18, roleTagY - roleH / 2, roleW, roleH, 8);
    ctx.fillStyle = isYellow ? '#0a6c38' : '#042814';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '800 15px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFE600';
    ctx.fillText((m.role || 'CORE BUILDER').toUpperCase(), mx + cardW / 2, roleTagY + 5);

    ctx.restore();
  }

  // 5. Footer Section (Spacious & Clean)
  const footY = H - 85;
  ctx.textAlign = 'left';
  ctx.font = '900 32px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#FF007A';
  ctx.fillText('#FrameInGoa', cx + 50, footY + 15);

  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FFE600';
  ctx.fillText('2:47 PM STUDIO · HACKER HOUSE GOA 2026', cx + 50, footY + 40);

  ctx.textAlign = 'right';
  ctx.font = '900 24px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('OFFICIAL SQUAD PASS', cx + cw - 50, footY + 15);

  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#BEF264';
  ctx.fillText('OCTOBER 28–31, 2026 // GOA, INDIA', cx + cw - 50, footY + 40);

  ctx.restore();
}

/* ========================================================
   ICONIC HH GOA LOGO & GRAPHICS DRAWING UTILITIES
   ======================================================== */

function drawHackerHouseLogo(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale = 1.0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // 1. "HACKER" and "HOUSE" in tall condensed serif Sunshine Yellow (#FFE600)
  ctx.font = '900 78px "DM Serif Display", "Playfair Display", "Times New Roman", serif';
  ctx.fillStyle = '#FFE600';
  ctx.textAlign = 'center';

  // Draw HACKER (left side) and HOUSE (right side)
  const leftX = -180;
  const rightX = 180;
  ctx.fillText('HACKER', leftX, 20);
  ctx.fillText('HOUSE', rightX, 20);

  // 2. Central Hot Pink "गोवा" Script in bold calligraphic style with yellow shadow
  ctx.font = '900 68px "Rozha One", "Yatra One", "Samarkan", "Arial", sans-serif';
  ctx.textAlign = 'center';

  // Shadow / outline
  ctx.strokeStyle = '#FFE600';
  ctx.lineWidth = 14;
  ctx.strokeText('गोवा', 0, 18);

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 8;
  ctx.strokeText('गोवा', 0, 18);

  // Fill in vibrant hot pink (#FF007A)
  ctx.fillStyle = '#FF007A';
  ctx.fillText('गोवा', 0, 18);

  ctx.restore();
}

// Draw rich Goa beach background with golden sun, soaring seagulls, rolling sea waves & lush palm trees
function drawRichGoaBeachBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();

  // 1. Golden Sunshine Sunburst Rays from top
  ctx.strokeStyle = 'rgba(255, 230, 0, 0.12)';
  ctx.lineWidth = 12;
  for (let angle = 0; angle <= Math.PI; angle += Math.PI / 18) {
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2 + Math.cos(angle) * w * 1.6, Math.sin(angle) * h * 1.2);
    ctx.stroke();
  }

  // 2. Distant Soaring Seagulls
  const seagulls = [
    { x: w * 0.18, y: 160, size: 18 },
    { x: w * 0.24, y: 130, size: 24 },
    { x: w * 0.78, y: 150, size: 22 },
    { x: w * 0.84, y: 180, size: 16 },
  ];
  ctx.strokeStyle = '#FFE600';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  seagulls.forEach((g) => {
    ctx.beginPath();
    ctx.arc(g.x - g.size / 2, g.y, g.size / 2, Math.PI, 0, false);
    ctx.arc(g.x + g.size / 2, g.y, g.size / 2, Math.PI, 0, false);
    ctx.stroke();
  });

  // 3. Rolling Ocean Wave Ripples across middle and bottom
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 4;
  for (let y = h - 280; y < h; y += 45) {
    ctx.beginPath();
    for (let x = 0; x <= w; x += 60) {
      ctx.quadraticCurveTo(x + 15, y - 10, x + 30, y);
      ctx.quadraticCurveTo(x + 45, y + 10, x + 60, y);
    }
    ctx.stroke();
  }

  // 4. Lush Coconut Palm Trees on Left Margin
  drawDetailedPalmTree(ctx, 70, h, -1, 1.1);

  // 5. Lush Coconut Palm Trees on Right Margin
  drawDetailedPalmTree(ctx, w - 70, h, 1, 1.1);

  ctx.restore();
}

// Draw realistic cartoon coconut palm tree
function drawDetailedPalmTree(ctx: CanvasRenderingContext2D, baseX: number, baseY: number, dir: number, scale: number) {
  ctx.save();
  ctx.translate(baseX, baseY);
  ctx.scale(scale * dir, scale);

  const topX = -60;
  const topY = -850;

  // Trunk
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(20, -400, topX, topY);
  ctx.quadraticCurveTo(topX + 15, topY, 25, 0);
  ctx.closePath();
  ctx.fillStyle = '#042814';
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Trunk Rings
  ctx.strokeStyle = 'rgba(255, 230, 0, 0.2)';
  ctx.lineWidth = 3;
  for (let i = 0.1; i < 0.9; i += 0.08) {
    const tY = topY * (1 - i);
    const tX = topX * (1 - i);
    ctx.beginPath();
    ctx.moveTo(tX - 12, tY);
    ctx.lineTo(tX + 18, tY - 8);
    ctx.stroke();
  }

  // Coconuts
  ctx.fillStyle = '#FFE600';
  ctx.beginPath();
  ctx.arc(topX - 10, topY + 20, 12, 0, Math.PI * 2);
  ctx.arc(topX + 10, topY + 24, 13, 0, Math.PI * 2);
  ctx.arc(topX, topY + 34, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Vibrant Palm Fronds
  const fronds = [
    { angle: -0.6, len: 200, curve: -80 },
    { angle: -0.2, len: 240, curve: -110 },
    { angle: 0.2, len: 230, curve: -90 },
    { angle: 0.7, len: 210, curve: -70 },
    { angle: 1.1, len: 180, curve: -50 },
    { angle: -1.0, len: 160, curve: -40 },
  ];

  fronds.forEach((f) => {
    ctx.save();
    ctx.translate(topX, topY);
    ctx.rotate(f.angle);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(f.len / 2, f.curve, f.len, 0);
    ctx.quadraticCurveTo(f.len / 2, f.curve + 30, 0, 0);
    ctx.fillStyle = '#0a6c38';
    ctx.fill();
    ctx.strokeStyle = '#D4FF00';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Leaf spine
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(f.len / 2, f.curve + 15, f.len, 0);
    ctx.strokeStyle = '#FFE600';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  });

  ctx.restore();
}

// Draw Beach Umbrella & Surfboard
function drawGoaBeachUmbrellaAndSurfboard(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1.0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // 1. Striped Surfboard leaning
  ctx.save();
  ctx.translate(-25, 0);
  ctx.rotate((-12 * Math.PI) / 180);

  // Surfboard Body
  ctx.beginPath();
  ctx.ellipse(0, -90, 22, 95, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#FFE600';
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Surfboard Hot Pink Chevron Stripe
  ctx.beginPath();
  ctx.ellipse(0, -90, 22, 95, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#FF007A';
  ctx.fillRect(-22, -120, 44, 40);
  ctx.fillStyle = '#064423';
  ctx.fillRect(-22, -60, 44, 15);
  ctx.restore();

  // 2. Beach Umbrella Pole
  ctx.beginPath();
  ctx.moveTo(35, 0);
  ctx.lineTo(20, -180);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 3. Striped Beach Umbrella Canopy (Yellow & Hot Pink)
  ctx.save();
  ctx.translate(20, -180);
  ctx.rotate((-8 * Math.PI) / 180);

  // Umbrella Canopy Dome
  ctx.beginPath();
  ctx.arc(0, 0, 80, Math.PI, 0, false);
  ctx.closePath();
  ctx.fillStyle = '#FFE600';
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5;
  ctx.stroke();

  // Hot Pink Stripes
  ctx.beginPath();
  ctx.arc(0, 0, 80, Math.PI, 0, false);
  ctx.clip();

  ctx.fillStyle = '#FF007A';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-40, 0);
  ctx.arc(0, 0, 80, Math.PI + 0.5, Math.PI + 1.1, false);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(15, 0);
  ctx.arc(0, 0, 80, Math.PI + 1.8, Math.PI + 2.4, false);
  ctx.closePath();
  ctx.fill();

  // Scalloped Rim
  ctx.fillStyle = '#000000';
  ctx.fillRect(-82, 0, 164, 4);

  // Umbrella Tip
  ctx.fillStyle = '#FFE600';
  ctx.fillRect(-4, -86, 8, 10);

  ctx.restore();

  ctx.restore();
}

// Draw fresh Goa Coconut Drink with straw, paper umbrella & sunglasses
function drawGoaCoconutDrink(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1.0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 30, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Green Coconut Body
  ctx.fillStyle = '#15803D';
  ctx.beginPath();
  ctx.arc(0, -28, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Cut Coconut Top (White flesh inside)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(0, -50, 18, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Coconut Water Inner
  ctx.fillStyle = '#86EFAC';
  ctx.beginPath();
  ctx.ellipse(0, -50, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Striped Straw (Hot Pink & Yellow)
  ctx.strokeStyle = '#FF007A';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -52);
  ctx.lineTo(16, -92);
  ctx.lineTo(26, -96);
  ctx.stroke();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Mini Paper Cocktail Umbrella
  ctx.save();
  ctx.translate(-14, -75);
  ctx.rotate((-20 * Math.PI) / 180);

  // Umbrella Canopy
  ctx.fillStyle = '#FFE600';
  ctx.beginPath();
  ctx.arc(0, 0, 24, Math.PI, 0, false);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Hot Pink Stripes on paper umbrella
  ctx.fillStyle = '#FF007A';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-12, 0);
  ctx.arc(0, 0, 24, Math.PI + 0.6, Math.PI + 1.2, false);
  ctx.closePath();
  ctx.fill();

  // Umbrella toothpick stick
  ctx.strokeStyle = '#92400E';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 32);
  ctx.stroke();
  ctx.restore();

  // Cool Retro Sunglasses on the Coconut
  ctx.fillStyle = '#FF007A';
  ctx.beginPath();
  ctx.roundRect(-22, -34, 18, 12, 3);
  ctx.roundRect(4, -34, 18, 12, 3);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Sunglasses bridge
  ctx.beginPath();
  ctx.moveTo(-4, -28);
  ctx.lineTo(4, -28);
  ctx.stroke();

  ctx.restore();
}

// Draw Retro Pink Goa Scooter heading LEFT with dynamic wind speed swirls, boy driving & girl with open laptop!
function drawGoaScooterHackerDuo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale = 1.0
) {
  ctx.save();
  ctx.translate(x, y);

  // 1. Dynamic Wind Swirls & Speed Streaks behind the scooter (to the right, near the bushes)
  drawWindSpeedSwirls(ctx, 40, -45);

  // Flip horizontal axis so the scooter rides towards the LEFT (away from the bushes & house)
  ctx.scale(-scale, scale);

  // 2. Road Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 95, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Rear Wheel
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-55, -20, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(-55, -20, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // 4. Front Wheel
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(55, -20, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(55, -20, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // 5. Chrome Exhaust Pipe
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-40, -16);
  ctx.lineTo(-75, -12);
  ctx.stroke();

  // 6. Scooter Body (Hot Pink #FF007A with black comic borders)
  ctx.fillStyle = '#FF007A';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;

  // Rear Cowl
  ctx.beginPath();
  ctx.roundRect(-68, -65, 62, 45, 14);
  ctx.fill();
  ctx.stroke();

  // Footboard / Chassis
  ctx.fillRect(-30, -26, 60, 10);
  ctx.strokeRect(-30, -26, 60, 10);

  // Front Apron
  ctx.beginPath();
  ctx.moveTo(25, -24);
  ctx.lineTo(40, -85);
  ctx.lineTo(56, -80);
  ctx.lineTo(45, -24);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Yellow Front Apron Strip
  ctx.fillStyle = '#FFE600';
  ctx.fillRect(40, -75, 8, 48);
  ctx.strokeRect(40, -75, 8, 48);

  // Dual Long Black Leather Seat
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.roundRect(-65, -72, 85, 12, 5);
  ctx.fill();

  // Handlebars & Headlamp
  ctx.fillStyle = '#FFE600';
  ctx.beginPath();
  ctx.arc(46, -92, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(35, -92);
  ctx.lineTo(58, -92);
  ctx.stroke();

  // License Plate GA-01
  ctx.font = '900 9px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FFE600';
  ctx.textAlign = 'center';
  ctx.fillText('GA-01', -38, -38);

  // ==========================================
  // 7. DRIVER (Boy leaning forward on handlebars)
  // ==========================================
  ctx.save();
  ctx.translate(5, -70);

  // Legs & Shorts
  ctx.fillStyle = '#064423';
  ctx.beginPath();
  ctx.moveTo(5, 0);
  ctx.lineTo(25, 30);
  ctx.lineTo(35, 45);
  ctx.lineTo(25, 48);
  ctx.lineTo(15, 32);
  ctx.lineTo(-5, 5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Torso / Yellow Beach Shirt
  ctx.fillStyle = '#FFE600';
  ctx.beginPath();
  ctx.moveTo(-12, -3);
  ctx.lineTo(16, -3);
  ctx.lineTo(22, -38);
  ctx.lineTo(-6, -38);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Shirt Collar
  ctx.fillStyle = '#FF007A';
  ctx.beginPath();
  ctx.moveTo(8, -38);
  ctx.lineTo(18, -30);
  ctx.lineTo(12, -26);
  ctx.closePath();
  ctx.fill();

  // Arms gripping handlebar
  ctx.fillStyle = '#FDBA74'; // Human skin tone
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(14, -32);
  ctx.lineTo(36, -24);
  ctx.lineTo(38, -20);
  ctx.stroke();

  // Head & Neck
  ctx.fillStyle = '#FDBA74';
  ctx.beginPath();
  ctx.arc(8, -54, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Boy's Ear
  ctx.fillStyle = '#FDBA74';
  ctx.beginPath();
  ctx.arc(0, -52, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Boy's Modern Textured Guy Haircut (Short tapered sides, clean sideburn, textured crop top)
  ctx.fillStyle = '#1C1917';
  ctx.beginPath();
  ctx.moveTo(14, -58); // Forehead hairline
  ctx.lineTo(19, -63); // Front textured spike
  ctx.lineTo(15, -67);
  ctx.lineTo(10, -71); // Top textured spike
  ctx.lineTo(4, -69);
  ctx.lineTo(-2, -70); // Crown spike
  ctx.lineTo(-7, -66);
  ctx.quadraticCurveTo(-14, -62, -14, -52); // Tapered back & fade
  ctx.lineTo(-9, -50); // Nape
  ctx.lineTo(-5, -54); // Behind ear
  ctx.lineTo(1, -54);
  ctx.lineTo(3, -50); // Sideburn
  ctx.lineTo(7, -56); // Temple
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Boy Retro Sunglasses
  ctx.fillStyle = '#FF007A';
  ctx.beginPath();
  ctx.roundRect(9, -56, 12, 7, 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Boy Smile
  ctx.beginPath();
  ctx.arc(15, -46, 3.5, 0, Math.PI * 0.8);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();

  // ==========================================
  // 8. PASSENGER (Girl with Open Laptop on Lap)
  // ==========================================
  ctx.save();
  ctx.translate(-40, -70);

  // Legs sitting upright on pillion
  ctx.fillStyle = '#064423';
  ctx.beginPath();
  ctx.moveTo(-5, 0);
  ctx.lineTo(15, 25);
  ctx.lineTo(24, 40);
  ctx.lineTo(15, 42);
  ctx.lineTo(5, 25);
  ctx.lineTo(-12, 5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Torso / Pink Beach Top
  ctx.fillStyle = '#FF007A';
  ctx.beginPath();
  ctx.moveTo(-10, -2);
  ctx.lineTo(12, -2);
  ctx.lineTo(10, -35);
  ctx.lineTo(-12, -35);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Head Base
  ctx.fillStyle = '#FED7AA'; // Human skin tone
  ctx.beginPath();
  ctx.arc(-2, -50, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Girl's Full Voluminous Hair (Front bangs + Crown + Long flowing windswept locks!)
  ctx.fillStyle = '#18181B';
  ctx.beginPath();
  // Start from front bangs framing the forehead
  ctx.moveTo(8, -48);
  ctx.quadraticCurveTo(12, -60, 4, -66); // Front top curve
  ctx.quadraticCurveTo(-6, -68, -14, -64); // Crown of head
  // Long ponytail / mane flowing backwards
  ctx.quadraticCurveTo(-38, -66, -55, -46); // Upper flow
  ctx.quadraticCurveTo(-46, -34, -58, -25); // Lower flow tip
  ctx.quadraticCurveTo(-40, -28, -28, -36); // Flow return
  ctx.quadraticCurveTo(-20, -40, -14, -46); // Nape of neck
  ctx.quadraticCurveTo(-6, -52, 6, -54); // Front hairline
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Cute Tropical Flower tucked in her hair (White petals with yellow center)
  drawHairFlower(ctx, -14, -58, 5.5);

  // Girl Retro Sunglasses (resting cleanly on face)
  ctx.fillStyle = '#FFE600';
  ctx.beginPath();
  ctx.roundRect(1, -52, 11, 7, 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Girl Smile
  ctx.beginPath();
  ctx.arc(6, -44, 3, 0, Math.PI * 0.8);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 9. Open Hacker Laptop in Girl's lap!
  ctx.save();
  ctx.translate(14, -12);

  // Laptop Base resting on knees
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.lineTo(16, 0);
  ctx.lineTo(14, -6);
  ctx.lineTo(-10, -6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Laptop Angled Screen
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.moveTo(14, -6);
  ctx.lineTo(24, -32);
  ctx.lineTo(-2, -32);
  ctx.lineTo(-10, -6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Glowing Screen with Mini Code
  ctx.fillStyle = '#064423';
  ctx.beginPath();
  ctx.moveTo(12, -8);
  ctx.lineTo(22, -30);
  ctx.lineTo(0, -30);
  ctx.lineTo(-8, -8);
  ctx.closePath();
  ctx.fill();

  // Glowing code lines on screen
  ctx.fillStyle = '#BEF264';
  ctx.fillRect(2, -26, 15, 2);
  ctx.fillStyle = '#FFE600';
  ctx.fillRect(0, -21, 13, 2);
  ctx.fillStyle = '#FF007A';
  ctx.fillRect(-2, -16, 11, 2);
  ctx.fillStyle = '#BEF264';
  ctx.fillRect(-4, -11, 14, 2);

  // Hands typing on keyboard
  ctx.strokeStyle = '#FED7AA';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-10, -25);
  ctx.lineTo(2, -8);
  ctx.stroke();

  ctx.restore();

  ctx.restore();

  ctx.restore();
}

// Draw dynamic cartoon wind swirl loops & speed streaks
function drawWindSpeedSwirls(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  // Swirl 1 (Upper loop)
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.quadraticCurveTo(35, -28, 55, -15);
  ctx.arc(62, -15, 7, Math.PI, -Math.PI * 0.4, false);
  ctx.stroke();

  // Swirl 2 (Center main loop)
  ctx.strokeStyle = '#FFE600';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.quadraticCurveTo(45, -5, 70, 8);
  ctx.arc(80, 8, 10, Math.PI, -Math.PI * 0.5, false);
  ctx.stroke();

  // Swirl 3 (Lower dust trail)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(15, 18);
  ctx.quadraticCurveTo(50, 16, 75, 24);
  ctx.arc(82, 24, 7, Math.PI, -Math.PI * 0.3, false);
  ctx.stroke();

  // Mini speed dash lines
  ctx.strokeStyle = '#BEF264';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(25, -35);
  ctx.lineTo(55, -35);
  ctx.moveTo(35, 32);
  ctx.lineTo(65, 32);
  ctx.stroke();

  ctx.restore();
}

// Draw cute 5-petal tropical Frangipani / Plumeria flower
function drawHairFlower(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size = 5.5
) {
  ctx.save();
  ctx.translate(x, y);

  // 5 White rounded petals
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const px = Math.cos(angle) * (size * 0.85);
    const py = Math.sin(angle) * (size * 0.85);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(px, py, size * 0.65, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.3;
    ctx.stroke();
  }

  // Sunshine Yellow Flower Center
  ctx.fillStyle = '#FFE600';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.restore();
}

// Directional arrow sign with auto-font scaling for long custom roles/classes
function drawDirectionalArrowSign(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  direction: 'left' | 'right',
  bgColor: string,
  textColor: string,
  text: string,
  fontBase: string
) {
  ctx.save();
  const arrowSize = 28;
  const x = cx - w / 2;
  const y = cy - h / 2;

  // Comic Black Shadow
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  if (direction === 'right') {
    ctx.moveTo(x + 6, y + 6);
    ctx.lineTo(x + w - arrowSize + 6, y + 6);
    ctx.lineTo(x + w + 6, y + h / 2 + 6);
    ctx.lineTo(x + w - arrowSize + 6, y + h + 6);
    ctx.lineTo(x + 6, y + h + 6);
  } else {
    ctx.moveTo(x + arrowSize + 6, y + 6);
    ctx.lineTo(x + w + 6, y + 6);
    ctx.lineTo(x + w + 6, y + h + 6);
    ctx.lineTo(x + arrowSize + 6, y + h + 6);
    ctx.lineTo(x + 6, y + h / 2 + 6);
  }
  ctx.closePath();
  ctx.fill();

  // Sign Board
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  if (direction === 'right') {
    ctx.moveTo(x, y);
    ctx.lineTo(x + w - arrowSize, y);
    ctx.lineTo(x + w, y + h / 2);
    ctx.lineTo(x + w - arrowSize, y + h);
    ctx.lineTo(x, y + h);
  } else {
    ctx.moveTo(x + arrowSize, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + arrowSize, y + h);
    ctx.lineTo(x, y + h / 2);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Auto scale text size if text is long
  ctx.font = fontBase;
  const availTextW = w - arrowSize - 40;
  let textWidth = ctx.measureText(text).width;
  if (textWidth > availTextW) {
    const scale = availTextW / textWidth;
    ctx.translate(cx, cy);
    ctx.scale(scale, 1);
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(text, 0, 7);
  } else {
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(text, cx, cy + 7);
  }

  ctx.restore();
}

function drawPopSignBadge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  bgColor: string,
  _borderColor: string,
  lines: { text: string; font: string; color: string; yOffset: number }[]
) {
  ctx.save();
  ctx.fillStyle = '#000000';
  roundRect(ctx, cx - w / 2 + 6, cy - h / 2 + 6, w, h, 14);
  ctx.fill();

  roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 14);
  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.stroke();

  lines.forEach((line) => {
    ctx.font = line.font;
    ctx.fillStyle = line.color;
    ctx.textAlign = 'center';
    ctx.fillText(line.text, cx, cy + line.yOffset);
  });

  ctx.restore();
}

// Draw tech tags with multi-tag support and neo-brutalist pop style
function drawPopTags(ctx: CanvasRenderingContext2D, cx: number, cy: number, tags: string[]) {
  ctx.save();
  const tagList = tags.slice(0, 6);
  if (tagList.length === 0) {
    ctx.restore();
    return;
  }

  ctx.font = '800 16px "JetBrains Mono", monospace';
  const pillH = 36;
  const pillPad = 20;
  const gap = 12;

  const pillWidths = tagList.map((t) => ctx.measureText(t).width + pillPad * 2);
  const totalW = pillWidths.reduce((a, b) => a + b, 0) + (tagList.length - 1) * gap;
  const maxW = 760;

  if (totalW <= maxW) {
    let startX = cx - totalW / 2;
    tagList.forEach((tag, idx) => {
      const pw = pillWidths[idx];
      ctx.fillStyle = '#000000';
      roundRect(ctx, startX + 4, cy - pillH / 2 + 4, pw, pillH, 8);
      ctx.fill();

      roundRect(ctx, startX, cy - pillH / 2, pw, pillH, 8);
      ctx.fillStyle = idx % 2 === 0 ? '#FFE600' : '#D4FF00';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#000000';
      ctx.fillText(tag, startX + pw / 2, cy + 6);
      startX += pw + gap;
    });
  } else {
    // Break into 2 rows for clean layout
    const mid = Math.ceil(tagList.length / 2);
    const row1 = tagList.slice(0, mid);
    const row2 = tagList.slice(mid);

    const drawRow = (rowItems: string[], rowY: number, startIdx: number) => {
      const widths = rowItems.map((t) => ctx.measureText(t).width + pillPad * 2);
      const rowW = widths.reduce((a, b) => a + b, 0) + (rowItems.length - 1) * gap;
      let startX = cx - rowW / 2;

      rowItems.forEach((tag, idx) => {
        const pw = widths[idx];
        ctx.fillStyle = '#000000';
        roundRect(ctx, startX + 4, rowY - pillH / 2 + 4, pw, pillH, 8);
        ctx.fill();

        roundRect(ctx, startX, rowY - pillH / 2, pw, pillH, 8);
        ctx.fillStyle = (startIdx + idx) % 2 === 0 ? '#FFE600' : '#D4FF00';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';
        ctx.fillText(tag, startX + pw / 2, rowY + 6);
        startX += pw + gap;
      });
    };

    drawRow(row1, cy - 22, 0);
    drawRow(row2, cy + 22, mid);
  }

  ctx.restore();
}

function drawGoaStamp(ctx: CanvasRenderingContext2D, cx: number, cy: number, pinkCol: string, yellowCol: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-10 * Math.PI) / 180);

  ctx.fillStyle = pinkCol;
  roundRect(ctx, -90, -45, 180, 90, 10);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = '900 24px "Space Grotesk", sans-serif';
  ctx.fillStyle = yellowCol;
  ctx.fillText('#FrameInGoa', 0, -8);

  ctx.font = '800 14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('VERIFIED 2026', 0, 20);

  ctx.restore();
}

function drawLanyardSlot(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  const sw = 140;
  const sh = 20;
  roundRect(ctx, x - sw / 2, y, sw, sh, 10);
  ctx.fillStyle = '#041f10';
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();
}

function drawBambooBeam(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  ctx.save();
  ctx.fillStyle = '#D4FF00';
  roundRect(ctx, x, y, w, 20, 8);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();
}
// Draw authentic cartoonish Portuguese Goan Villa / House in the corner (matching hhgoa.com art!)
function drawGoanHouseCorner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale = 1.0
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // 1. Tropical garden foliage / bushes on the left side of house
  ctx.fillStyle = '#042814';
  const bushes = [
    { x: -140, y: -20, r: 40 },
    { x: -110, y: -45, r: 35 },
    { x: -80, y: -70, r: 30 },
  ];
  bushes.forEach((b) => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.stroke();
  });

  // Agave / palm sharp leaves
  ctx.fillStyle = '#0a6c38';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  const leaves = [
    { x: -135, y: 0, tx: -160, ty: -50 },
    { x: -125, y: 0, tx: -140, ty: -70 },
    { x: -110, y: 0, tx: -115, ty: -85 },
    { x: -95, y: 0, tx: -85, ty: -65 },
  ];
  leaves.forEach((l) => {
    ctx.beginPath();
    ctx.moveTo(l.x, l.y);
    ctx.quadraticCurveTo(l.tx - 10, l.ty + 20, l.tx, l.ty);
    ctx.quadraticCurveTo(l.tx + 15, l.ty + 20, l.x + 15, l.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // 2. Main White Villa Facade Base & Porch
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.rect(-80, -180, 240, 180);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.stroke();

  // 3. Lower Porch Balustrade / Railings
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-75, -55, 100, 55);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.strokeRect(-75, -55, 100, 55);

  // Vertical Balustrade Bars
  for (let bx = -70; bx <= 20; bx += 9) {
    ctx.beginPath();
    ctx.moveTo(bx, -55);
    ctx.lineTo(bx, 0);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // 4. Hot Pink Louvered Goan Window with Green Glass (#FF007A)
  const winX = -45;
  const winY = -140;
  const winW = 48;
  const winH = 65;

  // Window Inner Frame (Deep Emerald Green)
  ctx.fillStyle = '#064423';
  ctx.fillRect(winX, winY, winW, winH);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.strokeRect(winX, winY, winW, winH);

  // Hot Pink Window Outer Frame Border
  ctx.strokeStyle = '#FF007A';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(winX - 2, winY - 2, winW + 4, winH + 4);

  // Left Shutter (Open Hot Pink with Louver Slats)
  ctx.fillStyle = '#FF007A';
  ctx.fillRect(winX - 24, winY, 22, winH);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(winX - 24, winY, 22, winH);
  // Louver slats
  for (let ly = winY + 6; ly < winY + winH - 4; ly += 6) {
    ctx.beginPath();
    ctx.moveTo(winX - 22, ly);
    ctx.lineTo(winX - 4, ly);
    ctx.stroke();
  }

  // Right Shutter (Open Hot Pink with Louver Slats)
  ctx.fillStyle = '#FF007A';
  ctx.fillRect(winX + winW + 2, winY, 22, winH);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(winX + winW + 2, winY, 22, winH);
  // Louver slats
  for (let ly = winY + 6; ly < winY + winH - 4; ly += 6) {
    ctx.beginPath();
    ctx.moveTo(winX + winW + 4, ly);
    ctx.lineTo(winX + winW + 22, ly);
    ctx.stroke();
  }

  // 5. Double Wooden French Door on Right Side
  const doorX = 35;
  const doorY = -150;
  const doorW = 55;
  const doorH = 150;

  ctx.fillStyle = '#F97316';
  ctx.fillRect(doorX, doorY, doorW, doorH);
  ctx.strokeStyle = '#FF007A';
  ctx.lineWidth = 5;
  ctx.strokeRect(doorX, doorY, doorW, doorH);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.strokeRect(doorX, doorY, doorW, doorH);

  // Door vertical split line & panels
  ctx.beginPath();
  ctx.moveTo(doorX + doorW / 2, doorY);
  ctx.lineTo(doorX + doorW / 2, doorY + doorH);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Louvers on door
  for (let dy = doorY + 12; dy < doorY + doorH - 40; dy += 7) {
    ctx.beginPath();
    ctx.moveTo(doorX + 5, dy);
    ctx.lineTo(doorX + doorW / 2 - 4, dy);
    ctx.moveTo(doorX + doorW / 2 + 4, dy);
    ctx.lineTo(doorX + doorW - 5, dy);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // 6. Terracotta Clay Tiled Porch Roof (Sloping Eaves)
  const roofY = -180;
  ctx.fillStyle = '#E06A3B';
  ctx.beginPath();
  ctx.moveTo(-110, roofY + 35);
  ctx.lineTo(-70, roofY);
  ctx.lineTo(160, roofY);
  ctx.lineTo(160, roofY + 35);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Clay Tile Rows & Scallops
  for (let ty = roofY + 8; ty <= roofY + 32; ty += 7) {
    ctx.beginPath();
    for (let tx = -105 + (ty - roofY); tx < 155; tx += 10) {
      ctx.arc(tx + 5, ty, 5, Math.PI, 0, false);
    }
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // 7. Upper Floor Clay Tile Roof
  const topRoofY = -230;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-65, topRoofY + 35, 200, 20);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.strokeRect(-65, topRoofY + 35, 200, 20);

  ctx.fillStyle = '#E06A3B';
  ctx.beginPath();
  ctx.moveTo(-95, topRoofY + 35);
  ctx.lineTo(-55, topRoofY);
  ctx.lineTo(160, topRoofY);
  ctx.lineTo(160, topRoofY + 35);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Upper clay tiles
  for (let ty = topRoofY + 8; ty <= topRoofY + 32; ty += 7) {
    ctx.beginPath();
    for (let tx = -90 + (ty - topRoofY); tx < 155; tx += 10) {
      ctx.arc(tx + 5, ty, 5, Math.PI, 0, false);
    }
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}
