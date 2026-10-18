import React from 'react';

interface CozyFoxIllustrationProps {
  className?: string;
  isSleeping?: boolean;
}

export const CozyFoxIllustration: React.FC<CozyFoxIllustrationProps> = ({ className = 'w-full h-auto max-w-lg' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 680 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
      >
        {/* Soft Background Warm Sun & Window Glow */}
        <g opacity="0.9">
          {/* Window Frame */}
          <rect x="230" y="20" width="220" height="150" rx="3" stroke="#2B2421" strokeWidth="2.5" fill="#FAF5ED" />
          <line x1="340" y1="20" x2="340" y2="170" stroke="#2B2421" strokeWidth="2.5" />
          <line x1="230" y1="95" x2="450" y2="95" stroke="#2B2421" strokeWidth="2.5" />
          <line x1="218" y1="170" x2="462" y2="170" stroke="#2B2421" strokeWidth="4" strokeLinecap="round" />

          {/* Warm Sun in the window */}
          <circle cx="300" cy="58" r="28" fill="#C85A32" />
          {/* Sun rays */}
          <line x1="300" y1="22" x2="300" y2="12" stroke="#2B2421" strokeWidth="1.8" />
          <line x1="274" y1="32" x2="265" y2="24" stroke="#2B2421" strokeWidth="1.8" />
          <line x1="258" y1="58" x2="248" y2="58" stroke="#2B2421" strokeWidth="1.8" />
          <line x1="274" y1="84" x2="266" y2="92" stroke="#2B2421" strokeWidth="1.8" />
          <line x1="300" y1="94" x2="300" y2="104" stroke="#2B2421" strokeWidth="1.8" />
          <line x1="326" y1="84" x2="334" y2="92" stroke="#2B2421" strokeWidth="1.8" />
          <line x1="326" y1="32" x2="335" y2="24" stroke="#2B2421" strokeWidth="1.8" />
        </g>

        {/* Floor Line */}
        <line x1="80" y1="305" x2="600" y2="305" stroke="#2B2421" strokeWidth="2" strokeLinecap="round" />

        {/* Floor Lamp (Left) */}
        <g stroke="#2B2421" strokeWidth="2.2" strokeLinecap="round">
          <ellipse cx="165" cy="305" rx="20" ry="4" fill="#EAE3D6" />
          <line x1="165" y1="305" x2="165" y2="155" />
          <circle cx="165" cy="155" r="3.5" fill="#2B2421" />
          <line x1="165" y1="155" x2="205" y2="85" />
          <circle cx="205" cy="85" r="3.5" fill="#2B2421" />
          <line x1="205" y1="85" x2="218" y2="95" />
          {/* Lamp shade */}
          <path
            d="M 205 90 L 235 70 L 248 115 L 210 115 Z"
            fill="#FAF5EE"
            stroke="#2B2421"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </g>

        {/* Side Table & Lamp (Right) */}
        <g stroke="#2B2421" strokeWidth="2" strokeLinecap="round">
          {/* Table top */}
          <ellipse cx="535" cy="245" rx="30" ry="7" fill="#FAF5EE" />
          {/* Table legs */}
          <line x1="518" y1="250" x2="510" y2="305" />
          <line x1="535" y1="252" x2="535" y2="305" />
          <line x1="552" y1="250" x2="560" y2="305" />
          {/* Table crossbar */}
          <ellipse cx="535" cy="275" rx="16" ry="4" fill="none" />

          {/* Small table lamp base */}
          <path d="M 530 245 C 525 235, 525 220, 535 210 C 545 220, 545 235, 540 245 Z" fill="#FAF5EE" />
          <line x1="535" y1="210" x2="535" y2="200" />
          {/* Lamp shade */}
          <path d="M 522 200 L 526 155 L 544 155 L 548 200 Z" fill="#C85A32" />
        </g>

        {/* Comfy Sofa */}
        <g stroke="#2B2421" strokeWidth="2.5" strokeLinejoin="round">
          {/* Sofa Backrest */}
          <path
            d="M 215 180 Q 215 170 225 170 L 465 170 Q 475 170 475 180 L 475 235 L 215 235 Z"
            fill="#FAF7F2"
          />
          {/* Sofa back division */}
          <line x1="345" y1="170" x2="345" y2="235" />

          {/* Sofa Cushions / Base */}
          <path
            d="M 205 235 Q 205 225 215 225 L 475 225 Q 485 225 485 235 L 485 285 Q 485 288 480 288 L 210 288 Q 205 288 205 285 Z"
            fill="#FAF5EE"
          />
          <line x1="345" y1="225" x2="345" y2="288" />

          {/* Left Armrest */}
          <rect x="195" y="215" width="22" height="73" rx="4" fill="#FAF7F2" />
          {/* Right Armrest */}
          <rect x="473" y="215" width="22" height="73" rx="4" fill="#FAF7F2" />

          {/* Sofa Legs */}
          <line x1="212" y1="288" x2="212" y2="305" strokeWidth="3" />
          <line x1="478" y1="288" x2="478" y2="305" strokeWidth="3" />
        </g>

        {/* Cozy Sleeping Red Fox curled on sofa */}
        <g>
          {/* Pillow under fox */}
          <path
            d="M 215 235 C 215 220, 240 215, 265 225 L 260 255 C 240 250, 220 245, 215 235 Z"
            fill="#C85A32"
            stroke="#2B2421"
            strokeWidth="2.2"
          />

          {/* Fox Body (warm curled donut shape) */}
          <ellipse cx="305" cy="235" rx="58" ry="34" fill="#C85A32" stroke="#2B2421" strokeWidth="2.5" />

          {/* Fox Back Leg Curl */}
          <ellipse cx="335" cy="232" rx="28" ry="24" fill="#C85A32" />

          {/* Fluffy White Tail Tip curled around */}
          <path
            d="M 335 240 C 355 240, 360 220, 340 212 C 315 210, 290 230, 305 250 C 320 255, 345 252, 350 235 Z"
            fill="#C85A32"
            stroke="#2B2421"
            strokeWidth="2.2"
          />
          {/* White tip */}
          <path
            d="M 310 248 C 302 240, 296 232, 298 226 C 304 220, 318 228, 335 236 C 322 245, 315 248, 310 248 Z"
            fill="#FFFFFF"
            stroke="#2B2421"
            strokeWidth="2"
          />

          {/* Fox Sleeping Head */}
          <path
            d="M 265 222 C 260 205, 275 195, 288 208 C 298 215, 292 235, 278 238 C 268 238, 266 228, 265 222 Z"
            fill="#C85A32"
            stroke="#2B2421"
            strokeWidth="2.2"
          />

          {/* Fox Ears */}
          <polygon points="262,208 252,185 272,198" fill="#C85A32" stroke="#2B2421" strokeWidth="2.2" strokeLinejoin="round" />
          <polygon points="256,204 254,192 266,200" fill="#2B2421" />

          <polygon points="280,202 292,182 298,205" fill="#C85A32" stroke="#2B2421" strokeWidth="2.2" strokeLinejoin="round" />
          <polygon points="284,198 290,188 294,202" fill="#2B2421" />

          {/* Fox Cheeks & Snout (White fur patch) */}
          <path
            d="M 268 228 C 272 234, 280 236, 284 230 C 286 226, 280 220, 275 222 C 270 224, 268 226, 268 228 Z"
            fill="#FFFFFF"
          />
          {/* Cute Nose */}
          <ellipse cx="275" cy="235" rx="3" ry="2.2" fill="#2B2421" />

          {/* Peaceful Closed Sleeping Eyes */}
          <path d="M 266 218 Q 270 222 274 219" stroke="#2B2421" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 280 219 Q 284 222 288 218" stroke="#2B2421" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
};
