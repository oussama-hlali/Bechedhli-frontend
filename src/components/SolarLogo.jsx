export default function SolarLogo({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="20" r="10" fill="#F97316"/>
      <g stroke="#F97316" strokeWidth="2.5" strokeLinecap="round">
        <line x1="28" y1="3" x2="28" y2="7"/>
        <line x1="28" y1="33" x2="28" y2="37"/>
        <line x1="13" y1="20" x2="9" y2="20"/>
        <line x1="47" y1="20" x2="43" y2="20"/>
        <line x1="16.5" y1="8.5" x2="13.7" y2="5.7"/>
        <line x1="42.3" y1="34.3" x2="39.5" y2="31.5"/>
        <line x1="39.5" y1="8.5" x2="42.3" y2="5.7"/>
        <line x1="13.7" y1="34.3" x2="16.5" y2="31.5"/>
      </g>
      <rect x="13" y="36" width="30" height="12" rx="2" fill="#1E40AF"/>
      <line x1="23" y1="36" x2="23" y2="48" stroke="#1E3A5F" strokeWidth="0.8"/>
      <line x1="28" y1="36" x2="28" y2="48" stroke="#1E3A5F" strokeWidth="0.8"/>
      <line x1="33" y1="36" x2="33" y2="48" stroke="#1E3A5F" strokeWidth="0.8"/>
      <line x1="13" y1="42" x2="43" y2="42" stroke="#1E3A5F" strokeWidth="0.8"/>
      <path d="M9 52 Q16 47 28 52 Q40 57 47 52" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
