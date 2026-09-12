import React from 'react';

interface LogoRProps {
  className?: string;
  style?: React.CSSProperties;
}

export const LogoR: React.FC<LogoRProps> = ({ className = 'w-6 h-6', style }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      style={style}
      aria-label="Logo R"
    >
      <path
        d="M 18 10 H 52 C 72 10 86 21 86 38 C 86 52 74 62 58 65 L 84 90 H 64 L 42 66 H 36 V 90 H 18 Z M 36 24 V 52 H 51 C 61 52 68 46 68 38 C 68 30 61 24 51 24 Z"
      />
    </svg>
  );
};
