/**
 * Westpac W-mark logo (stylized SVG reproduction).
 * Three red shapes forming a W — left trapezoid, middle rectangle, right trapezoid.
 * Brand color: #D1132F (Westpac Red). Kept brand-red in all themes.
 */

interface Props {
  size?: number;
  className?: string;
}

export function WestpacLogo({ size = 32, className = "" }: Props) {
  const width = size;
  const height = Math.round(size * (80 / 120));
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Westpac"
      role="img"
      className={className}
      style={{ color: "#D1132F" }}
    >
      <g fill="currentColor">
        {/* Left trapezoid — slants inward toward bottom */}
        <path d="M 4 6 Q 4 2 8 2 L 40 2 Q 44 2 43 7 L 35 73 Q 34 78 30 78 L 8 78 Q 3 78 3 73 Z" />
        {/* Middle vertical bar */}
        <rect x="51" y="2" width="18" height="76" rx="3" />
        {/* Right trapezoid — mirror of left */}
        <path d="M 77 7 Q 76 2 80 2 L 112 2 Q 116 2 116 6 L 117 73 Q 117 78 112 78 L 90 78 Q 86 78 85 73 Z" />
      </g>
    </svg>
  );
}
