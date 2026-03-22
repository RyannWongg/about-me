import React from 'react';

interface AnimatedIconProps {
  className?: string;
  isActive?: boolean;
}

// Student studying animation - student looking down at book with page flipping
export const StudentStudyingIcon: React.FC<AnimatedIconProps> = ({ className = '', isActive = false }) => {
  const accentColor = isActive ? '#39ff14' : 'currentColor';

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes pageFlipRight {
            0%, 40% { transform: rotateY(0deg); }
            50% { transform: rotateY(-160deg); }
            60%, 100% { transform: rotateY(-180deg); }
          }
          @keyframes headRead {
            0%, 100% { transform: rotate(0deg) translateY(0); }
            25% { transform: rotate(-2deg) translateY(0.5px); }
            75% { transform: rotate(2deg) translateY(0.5px); }
          }
          @keyframes bodyBreathe {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.015); }
          }
          @keyframes shadowPulse {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.25; }
          }
          .student-page-flip {
            animation: pageFlipRight 3s ease-in-out infinite;
            transform-origin: left center;
            transform-style: preserve-3d;
          }
          .student-head-read {
            animation: headRead 4s ease-in-out infinite;
            transform-origin: center bottom;
          }
          .student-body-breathe {
            animation: bodyBreathe 4s ease-in-out infinite;
            transform-origin: center bottom;
          }
          .book-shadow {
            animation: shadowPulse 3s ease-in-out infinite;
          }
        `}
      </style>

      {/* Table/Desk surface */}
      <ellipse cx="32" cy="52" rx="26" ry="6" fill={accentColor} opacity="0.1" />
      <path d="M8 50 Q32 56 56 50" stroke={accentColor} strokeWidth="1.5" opacity="0.3" fill="none" />

      {/* Book shadow */}
      <ellipse cx="32" cy="48" rx="14" ry="3" fill={accentColor} opacity="0.15" className="book-shadow" />

      {/* Open Book - Left page */}
      <path
        d="M18 44 L18 34 Q18 32 20 32 L31 32 L31 44 Q25 45 18 44 Z"
        fill={accentColor}
        opacity="0.2"
        stroke={accentColor}
        strokeWidth="1.5"
      />
      {/* Left page lines */}
      <line x1="21" y1="35" x2="28" y2="35" stroke={accentColor} strokeWidth="1" opacity="0.4" />
      <line x1="21" y1="38" x2="29" y2="38" stroke={accentColor} strokeWidth="1" opacity="0.35" />
      <line x1="21" y1="41" x2="27" y2="41" stroke={accentColor} strokeWidth="1" opacity="0.3" />

      {/* Open Book - Right page (static) */}
      <path
        d="M33 32 L44 32 Q46 32 46 34 L46 44 Q39 45 33 44 Z"
        fill={accentColor}
        opacity="0.15"
        stroke={accentColor}
        strokeWidth="1.5"
      />
      {/* Right page lines */}
      <line x1="36" y1="35" x2="43" y2="35" stroke={accentColor} strokeWidth="1" opacity="0.4" />
      <line x1="36" y1="38" x2="42" y2="38" stroke={accentColor} strokeWidth="1" opacity="0.35" />
      <line x1="36" y1="41" x2="41" y2="41" stroke={accentColor} strokeWidth="1" opacity="0.3" />

      {/* Book spine */}
      <line x1="32" y1="32" x2="32" y2="45" stroke={accentColor} strokeWidth="2" opacity="0.5" />

      {/* Flipping page */}
      <g className="student-page-flip">
        <path
          d="M33 32 L44 32 Q46 32 46 34 L46 44 Q39 45 33 44 Z"
          fill={accentColor}
          opacity="0.25"
          stroke={accentColor}
          strokeWidth="1"
        />
        <line x1="36" y1="36" x2="42" y2="36" stroke={accentColor} strokeWidth="0.8" opacity="0.5" />
        <line x1="36" y1="39" x2="41" y2="39" stroke={accentColor} strokeWidth="0.8" opacity="0.4" />
      </g>

      {/* Student Body - simple ellipse */}
      <g className="student-body-breathe">
        <ellipse cx="32" cy="30" rx="10" ry="6" fill={accentColor} opacity="0.2" stroke={accentColor} strokeWidth="1.5" />
      </g>

      {/* Head looking down */}
      <g className="student-head-read">
        {/* Head - simple circle */}
        <circle cx="32" cy="16" r="8" fill={accentColor} opacity="0.15" stroke={accentColor} strokeWidth="1.5" />

        {/* Glasses - two circles */}
        <circle cx="28" cy="17" r="3" stroke={accentColor} strokeWidth="1.2" fill="none" opacity="0.6" />
        <circle cx="36" cy="17" r="3" stroke={accentColor} strokeWidth="1.2" fill="none" opacity="0.6" />
        {/* Glasses bridge */}
        <line x1="31" y1="17" x2="33" y2="17" stroke={accentColor} strokeWidth="1" opacity="0.5" />
      </g>
    </svg>
  );
};

// IT Support animation - person at desk troubleshooting computer
export const ITSupportIcon: React.FC<AnimatedIconProps> = ({ className = '', isActive = false }) => {
  const accentColor = isActive ? '#39ff14' : 'currentColor';

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes screenFlicker {
            0%, 90%, 100% { opacity: 0.25; }
            92%, 98% { opacity: 0.5; }
          }
          @keyframes typingHands {
            0%, 100% { transform: translateY(0); }
            15% { transform: translateY(1.5px); }
            30% { transform: translateY(0); }
            45% { transform: translateY(1.5px); }
            60% { transform: translateY(0); }
          }
          @keyframes cursorBlink {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
          @keyframes codeLines {
            0%, 100% { transform: translateY(0); opacity: 0.5; }
            50% { transform: translateY(-2px); opacity: 0.7; }
          }
          @keyframes headThink {
            0%, 100% { transform: rotate(0deg) translateX(0); }
            30% { transform: rotate(-3deg) translateX(-1px); }
            70% { transform: rotate(3deg) translateX(1px); }
          }
          @keyframes gearSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .it-screen-flicker { animation: screenFlicker 4s ease-in-out infinite; }
          .it-typing { animation: typingHands 1.5s ease-in-out infinite; }
          .it-cursor { animation: cursorBlink 0.8s step-end infinite; }
          .it-code-lines { animation: codeLines 3s ease-in-out infinite; }
          .it-head-think { animation: headThink 5s ease-in-out infinite; transform-origin: center bottom; }
          .it-gear { animation: gearSpin 4s linear infinite; transform-origin: center; }
        `}
      </style>

      {/* Desk */}
      <rect x="6" y="50" width="52" height="4" rx="1" fill={accentColor} opacity="0.15" />
      <path d="M8 50 L56 50" stroke={accentColor} strokeWidth="1.5" opacity="0.3" />

      {/* Monitor */}
      <rect x="12" y="22" width="26" height="20" rx="2" stroke={accentColor} strokeWidth="1.5" fill={accentColor} opacity="0.1" />
      <rect x="12" y="22" width="26" height="20" rx="2" className="it-screen-flicker" fill={accentColor} />

      {/* Screen content - code/terminal */}
      <g className="it-code-lines">
        <line x1="15" y1="27" x2="28" y2="27" stroke={accentColor} strokeWidth="1.2" opacity="0.6" />
        <line x1="15" y1="31" x2="32" y2="31" stroke={accentColor} strokeWidth="1.2" opacity="0.5" />
        <line x1="17" y1="35" x2="26" y2="35" stroke={accentColor} strokeWidth="1.2" opacity="0.4" />
      </g>

      {/* Blinking cursor */}
      <rect x="28" y="35" width="2" height="4" fill={accentColor} className="it-cursor" opacity="0.8" />

      {/* Monitor stand */}
      <rect x="22" y="42" width="6" height="4" fill={accentColor} opacity="0.3" />
      <rect x="18" y="46" width="14" height="3" rx="1" fill={accentColor} opacity="0.25" />

      {/* Settings/Gear icon on screen (troubleshooting) */}
      <g className="it-gear" style={{ transformOrigin: '33px 28px' }}>
        <circle cx="33" cy="28" r="3" stroke={accentColor} strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="33" cy="28" r="1" fill={accentColor} opacity="0.5" />
      </g>

      {/* Person - simplified */}
      <g className="it-head-think">
        {/* Head - simple circle */}
        <circle cx="50" cy="26" r="6" fill={accentColor} opacity="0.15" stroke={accentColor} strokeWidth="1.5" />

        {/* Glasses - two circles */}
        <circle cx="47" cy="26" r="2.5" stroke={accentColor} strokeWidth="1.2" fill="none" opacity="0.6" />
        <circle cx="53" cy="26" r="2.5" stroke={accentColor} strokeWidth="1.2" fill="none" opacity="0.6" />
        {/* Glasses bridge */}
        <line x1="49.5" y1="26" x2="50.5" y2="26" stroke={accentColor} strokeWidth="1" opacity="0.5" />
      </g>

      {/* Body - simple ellipse */}
      <ellipse cx="50" cy="42" rx="8" ry="10" fill={accentColor} opacity="0.15" stroke={accentColor} strokeWidth="1.5" />

      {/* Arms reaching to keyboard */}
      <g className="it-typing">
        <path d="M44 38 Q38 44 34 48" stroke={accentColor} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4" />
      </g>

      {/* Keyboard */}
      <rect x="14" y="48" width="20" height="4" rx="1" fill={accentColor} opacity="0.2" stroke={accentColor} strokeWidth="1" />
      {/* Keyboard keys */}
      <line x1="18" y1="50" x2="30" y2="50" stroke={accentColor} strokeWidth="0.8" opacity="0.3" strokeDasharray="2 1" />
    </svg>
  );
};

// Web Developer animation - person coding with floating code elements
export const WebDeveloperIcon: React.FC<AnimatedIconProps> = ({ className = '', isActive = false }) => {
  const accentColor = isActive ? '#39ff14' : 'currentColor';

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes floatCode1 {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
            50% { transform: translateY(-4px) rotate(8deg); opacity: 1; }
          }
          @keyframes floatCode2 {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
            50% { transform: translateY(-5px) rotate(-6deg); opacity: 0.9; }
          }
          @keyframes floatCode3 {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
            50% { transform: translateY(-3px) scale(1.05); opacity: 0.7; }
          }
          @keyframes devThink {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
          }
          @keyframes devType {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(1px) rotate(2deg); }
            50% { transform: translateY(0) rotate(0deg); }
            75% { transform: translateY(1px) rotate(-2deg); }
          }
          @keyframes screenCode {
            0% { transform: translateY(0); }
            100% { transform: translateY(-4px); }
          }
          @keyframes screenGlow {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
          }
          .dev-float1 { animation: floatCode1 3.5s ease-in-out infinite; }
          .dev-float2 { animation: floatCode2 4s ease-in-out infinite 0.5s; }
          .dev-float3 { animation: floatCode3 3s ease-in-out infinite 1s; }
          .dev-head-think { animation: devThink 5s ease-in-out infinite; transform-origin: center bottom; }
          .dev-hands-type { animation: devType 1.2s ease-in-out infinite; }
          .dev-screen-code { animation: screenCode 4s linear infinite; }
          .dev-screen-glow { animation: screenGlow 2s ease-in-out infinite; }
        `}
      </style>

      {/* Floating code elements */}
      <g className="dev-float1">
        <text x="6" y="18" fill={accentColor} fontSize="11" fontFamily="monospace" fontWeight="bold" opacity="0.7">{'</>'}</text>
      </g>
      <g className="dev-float2">
        <text x="48" y="16" fill={accentColor} fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.6">{'{ }'}</text>
      </g>
      <g className="dev-float3">
        <text x="8" y="54" fill={accentColor} fontSize="9" fontFamily="monospace" opacity="0.5">{'[ ]'}</text>
      </g>

      {/* Desk */}
      <rect x="6" y="50" width="52" height="4" rx="1" fill={accentColor} opacity="0.15" />

      {/* Laptop Screen */}
      <path d="M14 28 L14 44 L50 44 L50 28 Z" fill={accentColor} opacity="0.1" stroke={accentColor} strokeWidth="1.5" />
      <rect x="14" y="28" width="36" height="16" className="dev-screen-glow" fill={accentColor} />

      {/* Code on screen */}
      <g className="dev-screen-code" clipPath="url(#laptopClip)">
        <line x1="18" y1="32" x2="30" y2="32" stroke={accentColor} strokeWidth="1.2" opacity="0.6" />
        <line x1="20" y1="35" x2="38" y2="35" stroke={accentColor} strokeWidth="1.2" opacity="0.5" />
        <line x1="20" y1="38" x2="32" y2="38" stroke={accentColor} strokeWidth="1.2" opacity="0.4" />
        <line x1="18" y1="41" x2="28" y2="41" stroke={accentColor} strokeWidth="1.2" opacity="0.5" />
        <line x1="18" y1="44" x2="36" y2="44" stroke={accentColor} strokeWidth="1.2" opacity="0.4" />
      </g>
      <defs>
        <clipPath id="laptopClip">
          <rect x="15" y="29" width="34" height="14" />
        </clipPath>
      </defs>

      {/* Laptop base/keyboard */}
      <path d="M10 44 L54 44 L52 50 L12 50 Z" fill={accentColor} opacity="0.2" stroke={accentColor} strokeWidth="1" />
      {/* Keyboard detail */}
      <line x1="18" y1="47" x2="46" y2="47" stroke={accentColor} strokeWidth="0.8" opacity="0.3" strokeDasharray="3 2" />

      {/* Person behind laptop - simplified */}
      {/* Head - simple circle */}
      <g className="dev-head-think">
        <circle cx="32" cy="14" r="7" fill={accentColor} opacity="0.15" stroke={accentColor} strokeWidth="1.5" />

        {/* Glasses - two circles */}
        <circle cx="29" cy="14" r="2.5" stroke={accentColor} strokeWidth="1.2" fill="none" opacity="0.6" />
        <circle cx="35" cy="14" r="2.5" stroke={accentColor} strokeWidth="1.2" fill="none" opacity="0.6" />
        {/* Glasses bridge */}
        <line x1="31.5" y1="14" x2="32.5" y2="14" stroke={accentColor} strokeWidth="1" opacity="0.5" />
      </g>

      {/* Body - simple ellipse (visible above laptop) */}
      <ellipse cx="32" cy="28" rx="10" ry="6" fill={accentColor} opacity="0.15" stroke={accentColor} strokeWidth="1.5" />

      {/* Hands on keyboard */}
      <g className="dev-hands-type">
        <ellipse cx="24" cy="46" rx="3" ry="2" fill={accentColor} opacity="0.3" />
        <ellipse cx="40" cy="46" rx="3" ry="2" fill={accentColor} opacity="0.3" />
      </g>
    </svg>
  );
};
