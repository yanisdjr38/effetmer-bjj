import React from 'react';

function ProgressCircle({ value, max = 5, size = 120, label }) {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div style={{ textAlign: 'center', margin: '1rem 0' }}>
      <svg height={size} width={size}>
        <circle
          stroke="#e0e0e0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="#00acc1"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="20px"
          fill="#2e3b3e"
        >
          {value}/{max}
        </text>
      </svg>
      <div style={{ marginTop: '0.5rem', color: '#2e3b3e', fontWeight: 'bold' }}>
        {label}
      </div>
    </div>
  );
}

export default ProgressCircle;