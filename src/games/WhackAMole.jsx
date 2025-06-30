import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const moleCount = 6;

const WhackAMole = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameRunning, setGameRunning] = useState(false);
  const [moleInterval, setMoleInterval] = useState(null);

  useEffect(() => {
    let timer;
    if (gameRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      clearInterval(moleInterval);
      setGameRunning(false);
      setActiveIndex(null);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameRunning]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameRunning(true);

    const interval = setInterval(() => {
      const index = Math.floor(Math.random() * moleCount);
      setActiveIndex(index);
      setTimeout(() => setActiveIndex(null), 700);
    }, 1000);

    setMoleInterval(interval);
  };

  const handleHit = (index) => {
    if (index === activeIndex && gameRunning) {
      setScore(score + 1);
      setActiveIndex(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white flex flex-col items-center py-8">
        <h1 className="text-3xl font-bold text-purple-400 mb-4">🐹 Whack-a-Mole</h1>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {Array(moleCount)
            .fill(0)
            .map((_, i) => (
              <button
                key={i}
                onClick={() => handleHit(i)}
                className={`w-24 h-24 rounded-lg text-black text-xl font-bold transition-all duration-300 ${
                  i === activeIndex ? "bg-purple-400" : "bg-gray-800"
                }`}
              >
                {i === activeIndex ? "🐹" : ""}
              </button>
            ))}
        </div>

        <div className="text-lg mb-4">
          <p>
            Score: <span className="text-green-400">{score}</span> | Time Left:{" "}
            <span className="text-red-400">{timeLeft}s</span>
          </p>
        </div>

        {!gameRunning && (
          <button
            onClick={startGame}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded shadow text-white"
          >
            Start / Restart
          </button>
        )}
      </div>
    </>
  );
};

export default WhackAMole;
