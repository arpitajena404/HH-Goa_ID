import React from 'react';

interface GoaBackgroundProps {
  theme?: 'light' | 'dark';
}

export const GoaBackground: React.FC<GoaBackgroundProps> = ({ theme = 'light' }) => {
  const isLight = theme === 'light';

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none transition-colors duration-500"
      aria-hidden="true"
    >
      {/* 1. Base Atmosphere & Ambient Sun Light */}
      {isLight ? (
        <>
          {/* Light Sun-Drenched Goa Sand / Beach Sky Gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#FFFDF8] via-[#F9F4E9] to-[#EFE7D5]"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 50% 20%, rgba(255, 230, 0, 0.40) 0%, rgba(255, 190, 0, 0.22) 35%, rgba(255, 248, 230, 0) 70%),
                radial-gradient(circle at 50% 50%, rgba(255, 230, 0, 0.25) 0%, rgba(255, 230, 0, 0.08) 50%, rgba(255, 255, 255, 0) 80%),
                linear-gradient(180deg, #FDFBF5 0%, #F6EFE2 50%, #ECE2CF 100%)
              `,
            }}
          />

          {/* RADIANT CENTRAL GOA SUN EFFECT with smooth breathing pulse animation */}
          <div
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1100px] h-[550px] sm:h-[750px] pointer-events-none animate-sun-pulse"
            style={{
              background: `
                radial-gradient(circle at 50% 30%, rgba(255, 230, 0, 0.50) 0%, rgba(255, 184, 0, 0.32) 40%, rgba(255, 130, 0, 0.15) 65%, transparent 85%)
              `,
              filter: 'blur(48px)',
            }}
          />

          {/* Central Subtle Sun Rays Stream */}
          <svg
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] opacity-35"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 600"
            fill="none"
          >
            <path d="M 500,0 L 420,600 L 460,600 Z" fill="url(#sun-ray-grad)" />
            <path d="M 500,0 L 540,600 L 580,600 Z" fill="url(#sun-ray-grad)" />
            <path d="M 500,0 L 320,600 L 370,600 Z" fill="url(#sun-ray-grad)" />
            <path d="M 500,0 L 630,600 L 680,600 Z" fill="url(#sun-ray-grad)" />
            <path d="M 500,0 L 200,600 L 260,600 Z" fill="url(#sun-ray-grad)" />
            <path d="M 500,0 L 740,600 L 800,600 Z" fill="url(#sun-ray-grad)" />
            <defs>
              <linearGradient id="sun-ray-grad" x1="500" y1="0" x2="500" y2="600" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFE600" stopOpacity="0.4" />
                <stop offset="0.6" stopColor="#FFB800" stopOpacity="0.15" />
                <stop offset="1" stopColor="#FFAA00" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating Subtle Ambient Sun Motes */}
          <div className="absolute top-[40%] left-[25%] w-3 h-3 rounded-full bg-[#FFE600] blur-[1px] animate-particle-1" />
          <div className="absolute top-[50%] left-[70%] w-2.5 h-2.5 rounded-full bg-[#FF007A] blur-[1px] animate-particle-2" />
          <div className="absolute top-[60%] left-[45%] w-3.5 h-3.5 rounded-full bg-[#FFE600] blur-[1px] animate-particle-3" />
          <div className="absolute top-[35%] left-[80%] w-2 h-2 rounded-full bg-[#D4FF00] blur-[1px] animate-particle-4" />

          {/* Delicate Goa Coastal Waves / Topography Lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="goa-topography"
                width="400"
                height="400"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0,80 Q100,50 200,80 T400,80 M0,160 Q100,130 200,160 T400,160 M0,240 Q100,210 200,240 T400,240 M0,320 Q100,290 200,320 T400,320"
                  fill="none"
                  stroke="#064423"
                  strokeWidth="0.8"
                  strokeOpacity="0.15"
                  strokeDasharray="4 6"
                />
                <circle cx="200" cy="200" r="1.5" fill="#064423" fillOpacity="0.2" />
                <circle cx="50" cy="90" r="1.2" fill="#FF007A" fillOpacity="0.2" />
                <circle cx="350" cy="310" r="1.5" fill="#FFE600" fillOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#goa-topography)" />
          </svg>
        </>
      ) : (
        <>
          {/* Dark Tropical Goa Jungle Gradient */}
          <div
            className="absolute inset-0 bg-[#085830]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 25%, rgba(255, 230, 0, 0.25) 0%, rgba(14, 132, 70, 0.7) 45%, #064423 100%)
              `,
            }}
          />
          {/* Subtle Grid in Dark Mode */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(#FFE600 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />
        </>
      )}

      {/* 2. Left Translucent Coconut Palm Trees with gentle animated breeze sway */}
      <div className="absolute top-0 left-0 w-[140px] sm:w-[220px] lg:w-[320px] h-full pointer-events-none opacity-30 sm:opacity-40 transform -translate-x-2 sm:translate-x-0 transition-opacity animate-palm-left">
        <svg
          viewBox="0 0 320 800"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Large Coconut Palm Trunk */}
          <path
            d="M 120,800 C 130,550 90,300 70,120"
            stroke={isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.4)'}
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 120,800 C 130,550 90,300 70,120"
            stroke="rgba(6, 68, 35, 0.4)"
            strokeWidth="2"
            fill="none"
          />
          {/* Trunk Bark Rings */}
          {[180, 240, 310, 390, 480, 580, 690].map((y, idx) => (
            <path
              key={idx}
              d={`M ${115 - idx * 2},${y} Q ${122 - idx * 2},${y - 4} ${130 - idx * 2},${y}`}
              stroke="rgba(6, 68, 35, 0.35)"
              strokeWidth="1.5"
              fill="none"
            />
          ))}

          {/* Left Palm Leaves Crown */}
          <g transform="translate(70, 120)">
            <path
              d="M 0,0 C -50,-60 -110,-70 -160,-40 C -120,-10 -60,10 0,0"
              fill="rgba(10, 136, 68, 0.65)"
              stroke="rgba(6, 68, 35, 0.5)"
              strokeWidth="1.5"
            />
            <path
              d="M -30,-25 L -45,-50 M -60,-30 L -85,-55 M -90,-30 L -120,-48 M -120,-25 L -150,-35"
              stroke="rgba(6, 68, 35, 0.4)"
              strokeWidth="1.2"
            />
            <path
              d="M 0,0 C -20,-90 40,-130 90,-110 C 60,-60 20,-20 0,0"
              fill="rgba(16, 176, 88, 0.7)"
              stroke="rgba(6, 68, 35, 0.5)"
              strokeWidth="1.5"
            />
            <path
              d="M 0,0 C 50,-80 130,-70 170,-20 C 120,0 50,10 0,0"
              fill="rgba(14, 160, 80, 0.65)"
              stroke="rgba(6, 68, 35, 0.5)"
              strokeWidth="1.5"
            />
            <path
              d="M 0,0 C 70,-40 140,20 160,80 C 110,60 50,30 0,0"
              fill="rgba(8, 112, 56, 0.6)"
              stroke="rgba(6, 68, 35, 0.5)"
              strokeWidth="1.5"
            />
            <path
              d="M 0,0 C -70,-30 -130,20 -150,80 C -100,55 -50,25 0,0"
              fill="rgba(8, 112, 56, 0.6)"
              stroke="rgba(6, 68, 35, 0.5)"
              strokeWidth="1.5"
            />
            <path
              d="M 0,0 C 10,-80 80,-90 120,-60 C 80,-30 30,-10 0,0"
              fill="rgba(20, 196, 100, 0.75)"
              stroke="rgba(6, 68, 35, 0.5)"
              strokeWidth="1.5"
            />
            <circle cx="-6" cy="10" r="10" fill="rgba(153, 101, 21, 0.6)" stroke="rgba(6, 68, 35, 0.5)" strokeWidth="1.2" />
            <circle cx="8" cy="14" r="9" fill="rgba(128, 80, 16, 0.6)" stroke="rgba(6, 68, 35, 0.5)" strokeWidth="1.2" />
            <circle cx="2" cy="22" r="8.5" fill="rgba(160, 112, 32, 0.6)" stroke="rgba(6, 68, 35, 0.5)" strokeWidth="1.2" />
          </g>

          {/* Left Mid-Sized Secondary Palm */}
          <path
            d="M 20,800 C 40,620 50,480 35,360"
            stroke={isLight ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.35)'}
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 20,800 C 40,620 50,480 35,360"
            stroke="rgba(6, 68, 35, 0.35)"
            strokeWidth="1.5"
            fill="none"
          />
          <g transform="translate(35, 360)">
            <path
              d="M 0,0 C -40,-40 -80,-30 -110,-10 C -70,10 -30,10 0,0"
              fill="rgba(14, 160, 80, 0.6)"
              stroke="rgba(6, 68, 35, 0.4)"
              strokeWidth="1.2"
            />
            <path
              d="M 0,0 C 30,-50 80,-40 100,-10 C 70,10 30,10 0,0"
              fill="rgba(16, 176, 88, 0.6)"
              stroke="rgba(6, 68, 35, 0.4)"
              strokeWidth="1.2"
            />
            <path
              d="M 0,0 C 10,-60 50,-70 80,-50 C 50,-20 20,-10 0,0"
              fill="rgba(20, 196, 100, 0.65)"
              stroke="rgba(6, 68, 35, 0.4)"
              strokeWidth="1.2"
            />
            <circle cx="-3" cy="8" r="6" fill="rgba(153, 101, 21, 0.5)" stroke="rgba(6, 68, 35, 0.4)" strokeWidth="1" />
            <circle cx="5" cy="10" r="5.5" fill="rgba(128, 80, 16, 0.5)" stroke="rgba(6, 68, 35, 0.4)" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* 3. Right Translucent Coconut Palm Trees with gentle animated breeze sway */}
      <div className="absolute top-0 right-0 w-[140px] sm:w-[220px] lg:w-[320px] h-full pointer-events-none opacity-30 sm:opacity-40 transform translate-x-2 sm:translate-x-0 transition-opacity animate-palm-right">
        <svg
          viewBox="0 0 320 800"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Right Large Coconut Palm Trunk */}
          <path
            d="M 200,800 C 190,550 230,300 250,120"
            stroke={isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.4)'}
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 200,800 C 190,550 230,300 250,120"
            stroke="rgba(6, 68, 35, 0.4)"
            strokeWidth="2"
            fill="none"
          />
          {/* Trunk Bark Rings */}
          {[180, 240, 310, 390, 480, 580, 690].map((y, idx) => (
            <path
              key={idx}
              d={`M ${205 + idx * 2},${y} Q ${198 + idx * 2},${y - 4} ${190 + idx * 2},${y}`}
              stroke="rgba(6, 68, 35, 0.35)"
              strokeWidth="1.5"
              fill="none"
            />
          ))}

          {/* Right Palm Leaves Crown */}
          <g transform="translate(250, 120)">
            <path
              d="M 0,0 C 50,-60 110,-70 160,-40 C 120,-10 60,10 0,0"
              fill="rgba(10, 136, 68, 0.65)"
              stroke="rgba(6, 68, 35, 0.5)"
              strokeWidth="1.5"
            />
            <path
              d="M 0,0 C 20,-90 -40,-130 -90,-110 C -60,-60 -20,-20 0,0"
              fill="rgba(16, 176, 88, 0.7)"
              stroke="rgba(6, 68, 35, 0.5)"
              strokeWidth="1.5"
            />
            <path
              d="M 0,0 C -50,-80 -130,-70 -170,-20 C -120,0 -50,10 0,0"
              fill="rgba(14, 160, 80, 0.65)"
              stroke="rgba(6, 68, 35, 0.5)"
              strokeWidth="1.5"
            />
            <path
              d="M 0,0 C -70,-40 -140,20 -160,80 C -110,60 -50,30 0,0"
              fill="rgba(8, 112, 56, 0.6)"
              stroke="rgba(6, 68, 35, 0.5)"
              strokeWidth="1.5"
            />
            <path
              d="M 0,0 C 70,-30 130,20 150,80 C 100,55 50,25 0,0"
              fill="rgba(8, 112, 56, 0.6)"
              stroke="rgba(6, 68, 35, 0.5)"
              strokeWidth="1.5"
            />
            <path
              d="M 0,0 C -10,-80 -80,-90 -120,-60 C -80,-30 -30,-10 0,0"
              fill="rgba(20, 196, 100, 0.75)"
              stroke="rgba(6, 68, 35, 0.5)"
              strokeWidth="1.5"
            />
            <circle cx="6" cy="10" r="10" fill="rgba(153, 101, 21, 0.6)" stroke="rgba(6, 68, 35, 0.5)" strokeWidth="1.2" />
            <circle cx="-8" cy="14" r="9" fill="rgba(128, 80, 16, 0.6)" stroke="rgba(6, 68, 35, 0.5)" strokeWidth="1.2" />
            <circle cx="-2" cy="22" r="8.5" fill="rgba(160, 112, 32, 0.6)" stroke="rgba(6, 68, 35, 0.5)" strokeWidth="1.2" />
          </g>

          {/* Right Mid-Sized Secondary Palm */}
          <path
            d="M 300,800 C 280,620 270,480 285,360"
            stroke={isLight ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.35)'}
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 300,800 C 280,620 270,480 285,360"
            stroke="rgba(6, 68, 35, 0.35)"
            strokeWidth="1.5"
            fill="none"
          />
          <g transform="translate(285, 360)">
            <path
              d="M 0,0 C 40,-40 80,-30 110,-10 C 70,10 30,10 0,0"
              fill="rgba(14, 160, 80, 0.6)"
              stroke="rgba(6, 68, 35, 0.4)"
              strokeWidth="1.2"
            />
            <path
              d="M 0,0 C -30,-50 -80,-40 -100,-10 C -70,10 -30,10 0,0"
              fill="rgba(16, 176, 88, 0.6)"
              stroke="rgba(6, 68, 35, 0.4)"
              strokeWidth="1.2"
            />
            <path
              d="M 0,0 C -10,-60 -50,-70 -80,-50 C -50,-20 -20,-10 0,0"
              fill="rgba(20, 196, 100, 0.65)"
              stroke="rgba(6, 68, 35, 0.4)"
              strokeWidth="1.2"
            />
            <circle cx="3" cy="8" r="6" fill="rgba(153, 101, 21, 0.5)" stroke="rgba(6, 68, 35, 0.4)" strokeWidth="1" />
            <circle cx="-5" cy="10" r="5.5" fill="rgba(128, 80, 16, 0.5)" stroke="rgba(6, 68, 35, 0.4)" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* 4. Bottom Translucent Floral & Monstera Border */}
      <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 pointer-events-none overflow-hidden opacity-35 sm:opacity-45 z-0">
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const x = i * 125 - 20;
            return (
              <g key={i} transform={`translate(${x}, 20)`}>
                <path
                  d="M 20,70 C 10,35 45,15 70,30 C 95,15 130,35 120,70 Z"
                  fill="rgba(10, 136, 68, 0.7)"
                  stroke="rgba(6, 68, 35, 0.5)"
                  strokeWidth="1.5"
                />
                {/* Bougainvillea Flower 1 */}
                <g transform="translate(45, 38)">
                  <path
                    d="M 0,-14 C 7,-10 8,0 0,6 C -8,0 -7,-10 0,-14 Z"
                    fill="rgba(255, 0, 122, 0.85)"
                    stroke="rgba(0, 0, 0, 0.4)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M 12,-4 C 14,4 6,8 0,6 C 4,0 6,-8 12,-4 Z"
                    fill="rgba(230, 0, 110, 0.85)"
                    stroke="rgba(0, 0, 0, 0.4)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M -12,-4 C -6,-8 -4,0 0,6 C -6,8 -14,4 -12,-4 Z"
                    fill="rgba(255, 46, 147, 0.85)"
                    stroke="rgba(0, 0, 0, 0.4)"
                    strokeWidth="1.2"
                  />
                  <circle cx="0" cy="2" r="2.5" fill="#FFE600" />
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
