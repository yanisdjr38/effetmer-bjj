import { useMemo } from "react";

/**
 * Composant ProgressCircle - Cercle de progression avec SVG
 * @param {number} value - Valeur actuelle
 * @param {number} max - Valeur maximale (défaut: 5)
 * @param {number} size - Taille du cercle en pixels (défaut: 120)
 * @param {string} label - Libellé du cercle
 * @returns {JSX.Element}
 */
function ProgressCircle({ value = 0, max = 5, size = 120, label = "" }) {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;

  const circumference = useMemo(
    () => normalizedRadius * 2 * Math.PI,
    [normalizedRadius],
  );

  const strokeDashoffset = useMemo(
    () => circumference - (value / max) * circumference,
    [value, max, circumference],
  );

  const percentage = Math.round((value / max) * 100);

  return (
    <div className="progress-circle-container">
      <div
        className="progress-ring"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <svg
          height={size}
          width={size}
          viewBox={`0 0 ${size} ${size}`}
          className="progress-svg"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <circle
            className="circle-bg"
            cx={size / 2}
            cy={size / 2}
            r={normalizedRadius}
          />
          <circle
            className="circle"
            cx={size / 2}
            cy={size / 2}
            r={normalizedRadius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".35em"
            fontSize={size * 0.2}
            fontWeight="bold"
            fill="#1f2937"
          >
            {percentage}%
          </text>
        </svg>
      </div>
      {label && <div className="progress-label">{label}</div>}
    </div>
  );
}

export default ProgressCircle;
