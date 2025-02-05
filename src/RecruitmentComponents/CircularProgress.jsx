import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Funkcja do wyliczania kolorów gradientu na podstawie procentowego wypełnienia
const getProgressGradient = (percentage) => {
  const red = Math.max(255 - (percentage * 2), 0); // Im mniejszy procent, tym więcej czerwieni
  const green = Math.max(percentage * 2, 0); // Im większy procent, tym więcej zieleni
  const blue = 0; // Tylko czerwony i zielony będą się zmieniały

  return `rgb(${red}, ${green}, ${blue})`;
};

const CircularProgress = ({ score }) => {
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Obliczanie procentowego postępu wypełnienia
  const progress = (score / 100) * circumference;
  const percentage = (score / 100) * 100; // Procentowe wypełnienie okręgu

  const [gradientColor, setGradientColor] = useState(getProgressGradient(percentage));
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 2; // Czas trwania animacji w sekundach
    const totalSteps = 100; // Ustalamy, że animacja będzie miała 100 kroków
    const intervalTime = (duration * 1000) / totalSteps; // Czas na każdy krok (w milisekundach)

    let start = 0;
    const interval = setInterval(() => {
      setGradientColor(getProgressGradient(start)); // Zaktualizowanie gradientu
      if (start < score) {
        start += score / totalSteps; // Równomierne zwiększanie liczby
        setDisplayScore(start.toFixed(2)); // Wyświetlanie liczby z 2 miejscami po przecinku
      } else {
        clearInterval(interval); // Zatrzymanie animacji po osiągnięciu score
        setDisplayScore(score.toFixed(2)); // Ustawienie końcowego wyniku
      }
    }, intervalTime);

    return () => clearInterval(interval); // Wyczyść interval po zakończeniu animacji
  }, [score]);

  return (
    <div className="relative w-[160px] h-[160px] flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Tło okręgu */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)" // Blade tło
          strokeWidth={strokeWidth}
        />

        {/* Animowany pasek z dynamicznym gradientem */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={gradientColor} // Zmieniany dynamicznie kolor gradientu
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>

      {/* Wynik w środku */}
      <motion.span className="absolute text-2xl font-bold text-white drop-shadow-lg">
        {displayScore}% {/* Wyświetlanie z dwoma miejscami po przecinku */}
      </motion.span>
    </div>
  );
};

export default CircularProgress;
