import { useTheme } from "./ThemeProvider";

export function HeroIllustration() {
  const { isDark } = useTheme();
  const accent = isDark ? "#00e89a" : "#179e90";
  const stroke = isDark ? "#4a4a5a" : "#1a1a1a";
  const fill = isDark ? "#101018" : "#f7f5f2";
  const labelColor = isDark ? "#5e5e78" : "#6b6560";

  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      {/* Background organic shape */}
      <path
        d="M40 140C40 80 80 40 160 40C240 40 280 80 280 140C280 200 240 250 160 250C80 250 40 200 40 140Z"
        fill={accent}
        fillOpacity={isDark ? "0.04" : "0.06"}
      />

      {/* Central node */}
      <circle cx="160" cy="140" r="28" stroke={accent} strokeWidth="1.5" fill={fill} />
      <circle cx="160" cy="140" r="4" fill={accent} fillOpacity="0.4" />

      {/* Images node */}
      <circle cx="85" cy="95" r="18" stroke={stroke} strokeWidth="1" fill={fill} />
      <line x1="103" y1="103" x2="135" y2="125" stroke={stroke} strokeWidth="0.75" strokeDasharray="3 3" />
      <path d="M78 100L85 90L92 100H78Z" stroke={accent} strokeWidth="1" fill="none" />

      {/* UI node */}
      <circle cx="240" cy="100" r="18" stroke={stroke} strokeWidth="1" fill={fill} />
      <line x1="222" y1="108" x2="188" y2="128" stroke={stroke} strokeWidth="0.75" strokeDasharray="3 3" />
      <rect x="232" y="93" width="16" height="14" rx="2" stroke={accent} strokeWidth="1" fill="none" />
      <line x1="232" y1="99" x2="248" y2="99" stroke={accent} strokeWidth="0.75" />

      {/* Writing node */}
      <circle cx="160" cy="230" r="18" stroke={stroke} strokeWidth="1" fill={fill} />
      <line x1="160" y1="212" x2="160" y2="168" stroke={stroke} strokeWidth="0.75" strokeDasharray="3 3" />
      <line x1="153" y1="236" x2="167" y2="222" stroke={accent} strokeWidth="1" />
      <line x1="153" y1="236" x2="156" y2="233" stroke={accent} strokeWidth="2" />

      {/* Labels */}
      <text x="85" y="125" textAnchor="middle" fill={labelColor} fontSize="9" fontFamily="'JetBrains Mono', monospace">images</text>
      <text x="240" y="130" textAnchor="middle" fill={labelColor} fontSize="9" fontFamily="'JetBrains Mono', monospace">ui</text>
      <text x="160" y="262" textAnchor="middle" fill={labelColor} fontSize="9" fontFamily="'JetBrains Mono', monospace">writing</text>

      {/* Decorative dots */}
      <circle cx="120" cy="70" r="2" fill={accent} fillOpacity="0.3" />
      <circle cx="210" cy="65" r="1.5" fill={accent} fillOpacity="0.2" />
      <circle cx="100" cy="190" r="2" fill={accent} fillOpacity="0.15" />
      <circle cx="225" cy="195" r="1.5" fill={accent} fillOpacity="0.25" />

      {/* Connecting arcs */}
      <path d="M85 113C85 160 120 200 160 212" stroke={stroke} strokeWidth="0.5" strokeDasharray="2 4" fill="none" />
      <path d="M240 118C240 165 200 200 160 212" stroke={stroke} strokeWidth="0.5" strokeDasharray="2 4" fill="none" />
    </svg>
  );
}

export function DoodleDivider() {
  return (
    <svg
      viewBox="0 0 200 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-24 h-5 mx-auto"
    >
      <path
        d="M20 10C40 4 60 16 80 10C100 4 120 16 140 10C160 4 180 16 180 10"
        stroke="#179e90"
        strokeWidth="1"
        strokeLinecap="round"
        fillOpacity="0"
      />
      <circle cx="100" cy="10" r="2" fill="#179e90" fillOpacity="0.4" />
    </svg>
  );
}

export function SmallDoodle() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 inline-block"
    >
      <circle cx="12" cy="12" r="3" stroke="#179e90" strokeWidth="1" />
      <path d="M12 4V8M12 16V20M4 12H8M16 12H20" stroke="#179e90" strokeWidth="0.75" strokeLinecap="round" />
    </svg>
  );
}

export function CornerDoodle() {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-16"
    >
      <path
        d="M5 75C5 40 20 15 55 5"
        stroke="#179e90"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
      <circle cx="55" cy="5" r="3" fill="#179e90" fillOpacity="0.3" />
      <circle cx="5" cy="75" r="2" fill="#179e90" fillOpacity="0.2" />
      <circle cx="30" cy="30" r="1.5" fill="#179e90" fillOpacity="0.15" />
    </svg>
  );
}
