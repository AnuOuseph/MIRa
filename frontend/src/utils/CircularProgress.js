const CircularProgress = ({ value = 30, size = 120, stroke = 7 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = (value / 100) * circumference;

  return (
    <div className="flex items-center justify-center w-fit">
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#eff2f5"
          strokeWidth={stroke}
          fill="transparent"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#515bc3"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>

      {/* Text in center */}
      <div className="absolute text-sm font-semibold text-gray-800 flex flex-col items-center justify-center">
        <p className="text-2xl">{value.toFixed(0)}</p>
        <p className="text-[10px] text-gray-500 font-[monospace] uppercase tracking-[1px]">Score</p>
      </div>
    </div>
  );
};

export default CircularProgress;