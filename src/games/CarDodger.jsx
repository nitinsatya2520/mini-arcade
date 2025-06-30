import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

const CarDodger = () => {
  const canvasRef = useRef(null);
  const canvasWidth = 300;
  const canvasHeight = 500;
  const carWidth = 40;
  const carHeight = 60;
  const speed = 2;
  const laneCount = 3;

  const [lane, setLane] = useState(1);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("carDodgeHighScore")) || 0
  );

  const obstaclesRef = useRef([]);
  const scoreRef = useRef(0);

  const getLaneX = (laneIndex) => {
    const laneWidth = canvasWidth / laneCount;
    return laneIndex * laneWidth + (laneWidth - carWidth) / 2;
  };

  const handleStart = () => {
    setLane(1);
    obstaclesRef.current = [];
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setStarted(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const moveLeft = () => lane > 0 && setLane((prev) => prev - 1);
  const moveRight = () => lane < laneCount - 1 && setLane((prev) => prev + 1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!started || gameOver) return;
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started, gameOver, lane]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    let animationFrame;
    let frameCount = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Background
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Lanes
      ctx.strokeStyle = "#444";
      ctx.setLineDash([10, 10]);
      for (let i = 1; i < laneCount; i++) {
        ctx.beginPath();
        ctx.moveTo((canvasWidth / laneCount) * i, 0);
        ctx.lineTo((canvasWidth / laneCount) * i, canvasHeight);
        ctx.stroke();
      }

      // Draw player car (emoji)
      const carX = getLaneX(lane);
      const carY = canvasHeight - carHeight - 10;
      ctx.font = "40px serif";
      ctx.fillText("🚗", carX, carY + carHeight - 10);

      // Draw obstacles (emoji 🚓)
      ctx.setLineDash([]);
      obstaclesRef.current.forEach((obs) => {
        obs.y += speed;
        const obsX = getLaneX(obs.lane);
        ctx.fillText("🚓", obsX, obs.y + carHeight - 10);
      });

      // Collision detection
      for (let obs of obstaclesRef.current) {
        if (
          obs.lane === lane &&
          obs.y + carHeight > carY &&
          obs.y < carY + carHeight
        ) {
          setGameOver(true);
          setStarted(false);
          if (scoreRef.current > highScore) {
            localStorage.setItem("carDodgeHighScore", scoreRef.current);
            setHighScore(scoreRef.current);
          }
          return;
        }
      }

      // Remove off-screen obstacles
      obstaclesRef.current = obstaclesRef.current.filter((obs) => obs.y < canvasHeight);

      // Spawn obstacles
      if (started && !gameOver && frameCount % 100 === 0) {
        const newLane = Math.floor(Math.random() * laneCount);
        const lastObstacle = obstaclesRef.current[obstaclesRef.current.length - 1];
        if (!lastObstacle || lastObstacle.y > carHeight * 2) {
          obstaclesRef.current.push({ lane: newLane, y: -carHeight });
          scoreRef.current += 1;
          setScore(scoreRef.current);
        }
      }

      // UI: Score + Countdown + Game Over
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(`Score: ${score}`, 10, 25);
      ctx.fillText(`High Score: ${highScore}`, 10, 45);

      if (countdown !== null) {
        ctx.fillStyle = "#facc15";
        ctx.font = "48px sans-serif";
        ctx.fillText(countdown, canvasWidth / 2 - 15, canvasHeight / 2);
      }

      if (gameOver) {
        ctx.fillStyle = "#ef4444";
        ctx.font = "28px sans-serif";
        ctx.fillText("Game Over", 75, canvasHeight / 2);
      }

      frameCount++;
      animationFrame = requestAnimationFrame(render);
    };

    if (started || countdown !== null) {
      animationFrame = requestAnimationFrame(render);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [started, countdown, lane, gameOver, score, highScore]);

  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen text-white flex flex-col items-center pt-6 px-4">
        <h1 className="text-3xl font-bold text-purple-400 mb-4">🚗 Car Dodger</h1>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border-4 border-purple-500 rounded"
        />
        <p className="mt-4 text-gray-400">Use Arrows or Tap Buttons to Move</p>
        <button
          onClick={handleStart}
          className="mt-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          {gameOver || !started ? "Start Game" : "Restart"}
        </button>

        {/* Mobile Controls */}
        <div className="flex gap-6 mt-6 md:hidden">
          <button
            onClick={moveLeft}
            className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded text-xl"
          >
            ⬅️
          </button>
          <button
            onClick={moveRight}
            className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded text-xl"
          >
            ➡️
          </button>
        </div>
      </div>
    </>
  );
};

export default CarDodger;
