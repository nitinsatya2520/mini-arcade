import React, { useEffect, useRef, useState } from "react";
import helicopterImgSrc from "../assets/heli.png";
import Navbar from "../components/Navbar";

const HelicopterGame = () => {
  const canvasRef = useRef(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const heli = useRef({ x: 200, y: 200, dy: 0 });
  const heliImg = useRef(new Image());
  const obstacles = useRef([]);
  const gameInterval = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    heliImg.current.src = helicopterImgSrc;

    heliImg.current.onload = () => {
      resetGame();
      document.addEventListener("keydown", handleKey);
      canvas.addEventListener("click", flap);
      gameInterval.current = setInterval(() => gameLoop(ctx), 20);
    };

    return () => {
      clearInterval(gameInterval.current);
      document.removeEventListener("keydown", handleKey);
      canvas.removeEventListener("click", flap);
    };
  }, []);

  const handleKey = (e) => {
    if (e.code === "Space") {
      if (isGameOver) {
        resetGame();
        const ctx = canvasRef.current.getContext("2d");
        gameInterval.current = setInterval(() => gameLoop(ctx), 20);
      } else {
        flap();
      }
    }
  };

  const flap = () => {
    if (!isGameOver && !isPaused) heli.current.dy = -6;
  };

  const resetGame = () => {
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    heli.current = { x: 200, y: 200, dy: 0 };
    obstacles.current = [];
  };

  const togglePause = () => {
    setIsPaused((prev) => {
      const newPause = !prev;
      if (!newPause) {
        const ctx = canvasRef.current.getContext("2d");
        gameInterval.current = setInterval(() => gameLoop(ctx), 20);
      } else {
        clearInterval(gameInterval.current);
      }
      return newPause;
    });
  };

  const gameLoop = (ctx) => {
    if (isPaused || isGameOver) return;

    ctx.clearRect(0, 0, 800, 500);

    // Background
    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(0, 0, 800, 500);

    // Gravity
    heli.current.dy += 0.3;
    heli.current.y += heli.current.dy;

    // Draw helicopter
    if (heliImg.current.complete) {
      ctx.drawImage(heliImg.current, heli.current.x, heli.current.y, 40, 30);
    }

    // Obstacles
    if (Math.random() < 0.015) {
      const height = Math.random() * 200 + 50;
      const gap = 180;

      obstacles.current.push({
        x: 0,
        y: 0,
        width: 30,
        height,
        passed: false,
        isTop: true,
      });

      obstacles.current.push({
        x: 0,
        y: height + gap,
        width: 30,
        height: 500 - height - gap,
        passed: false,
        isTop: false,
      });
    }

    obstacles.current.forEach((ob) => {
      ob.x += 2.5;
      ctx.fillStyle = ob.isTop ? "#4f46e5" : "#bb86fc";
      ctx.fillRect(ob.x, ob.y, ob.width, ob.height);

      if (
        heli.current.x < ob.x + ob.width &&
        heli.current.x + 40 > ob.x &&
        heli.current.y < ob.y + ob.height &&
        heli.current.y + 30 > ob.y
      ) {
        setIsGameOver(true);
        clearInterval(gameInterval.current);
      }

      if (!ob.passed && ob.x > heli.current.x) {
        ob.passed = true;
        setScore((prev) => prev + 0.5);
      }
    });

    obstacles.current = obstacles.current.filter((ob) => ob.x < 800);

    // Out of bounds
    if (heli.current.y < 0 || heli.current.y > 470) {
      setIsGameOver(true);
      clearInterval(gameInterval.current);
    }

    // Score display
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px monospace";
    ctx.fillText(`Score: ${Math.floor(score)}`, 20, 30);

    // Game over message
    if (isGameOver) {
      ctx.fillStyle = "#ff3333";
      ctx.font = "40px sans-serif";
      ctx.fillText("Game Over", 280, 250);
      ctx.font = "20px sans-serif";
      ctx.fillText("Click or press Space to restart", 230, 280);
    }
  };

  return (
    <><Navbar/>
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-3xl text-white mb-4 font-bold">Helicopter Game</h1>

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="rounded-xl shadow-xl border-4 border-purple-600"
      ></canvas>

      <div className="flex gap-4 mt-4">
        <button
          onClick={togglePause}
          className="bg-purple-700 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={() => {
            resetGame();
            const ctx = canvasRef.current.getContext("2d");
            clearInterval(gameInterval.current);
            gameInterval.current = setInterval(() => gameLoop(ctx), 20);
          }}
          className="bg-red-600 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>
    </div></>
  );
};

export default HelicopterGame;
