import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Funkcja do wyliczania kolorów gradientu na podstawie procentowego wypełnienia
const getProgressGradient = (percentage) => {
  const red = Math.max(255 - percentage * 2, 0); // Im mniejszy procent, tym więcej czerwieni
  const green = Math.max(percentage * 2, 0); // Im większy procent, tym więcej zieleni
  return `rgb(${red}, ${green}, 0)`;
};

const CircularProgress = ({ score, size = 160 }) => {
  const strokeWidth = size * 0.0875; // Skalowany strokeWidth (~14 dla size=160)
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const maxScore = Math.min(score, 100); // Ograniczamy progres do 100%
  const progress = (maxScore / 100) * circumference;
  const percentage = (maxScore / 100) * 100;

  const [gradientColor, setGradientColor] = useState(getProgressGradient(percentage));
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 2;
    const totalSteps = 100;
    const intervalTime = (duration * 1000) / totalSteps;

    let start = 0;
    const interval = setInterval(() => {
      setGradientColor(getProgressGradient(Math.min(start, 100)));
      if (start < maxScore) {
        start += score / totalSteps;
        setDisplayScore(start.toFixed(2));
      } else {
        clearInterval(interval);
        setDisplayScore(score.toFixed(2));
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Tło okręgu */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
        />

        {/* Animowany pasek z dynamicznym gradientem */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={gradientColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>

      {/* Wynik w środku */}
      <motion.span className="absolute font-bold text-white drop-shadow-lg" style={{ fontSize: size * 0.2 }}>
        {displayScore}%
      </motion.span>
    </div>
  );
};

export default CircularProgress;
