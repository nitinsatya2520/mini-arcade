import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

const FlappyBird = () => {
  const canvasRef = useRef(null);
  const velocityRef = useRef(0);
  const [birdY, setBirdY] = useState(150);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const gravity = 0.6;
  const jumpStrength = -10;
  const pipeGap = 120;
  const pipeWidth = 50;
  const birdX = 80;

  const startGame = () => {
    setBirdY(150);
    velocityRef.current = 0;
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setStarted(true);
  };

  const handleJump = () => {
    if (!started || gameOver) return;
    velocityRef.current = jumpStrength;
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === " " || e.key === "ArrowUp") handleJump();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, gameOver]);

  useEffect(() => {
    let animationId;

    const updateGame = () => {
      setBirdY((prevY) => {
        const newY = prevY + velocityRef.current;
        if (newY >= 400 || newY <= 0) {
          setGameOver(true);
          setStarted(false);
          return 150;
        }
        return newY;
      });

      velocityRef.current += gravity;

      setPipes((prevPipes) => {
        let updated = prevPipes
          .map((pipe) => ({ ...pipe, x: pipe.x - 2 }))
          .filter((pipe) => pipe.x + pipeWidth > 0);

        if (updated.length === 0 || updated[updated.length - 1].x < 200) {
          const topHeight = Math.floor(Math.random() * 200) + 20;
          updated.push({ x: 400, topHeight });
        }

        updated.forEach((pipe) => {
          if (
            pipe.x < birdX + 20 &&
            pipe.x + pipeWidth > birdX &&
            (birdY < pipe.topHeight || birdY > pipe.topHeight + pipeGap)
          ) {
            setGameOver(true);
            setStarted(false);
          }
          if (pipe.x === birdX) {
            setScore((prev) => prev + 1);
          }
        });

        return updated;
      });

      drawGame();
      if (!gameOver) {
        animationId = requestAnimationFrame(updateGame);
      }
    };

    if (started && !gameOver) {
      animationId = requestAnimationFrame(updateGame);
    }

    return () => cancelAnimationFrame(animationId);
  }, [started, gameOver, birdY]);

  const drawGame = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 400, 400);

    // Bird
    ctx.fillStyle = "#bb86fc";
    ctx.beginPath();
    ctx.arc(birdX, birdY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Pipes
    ctx.fillStyle = "#22c55e";
    pipes.forEach((pipe) => {
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
      ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, 400);
    });

    // Score
    ctx.fillStyle = "#fff";
    ctx.font = "20px sans-serif";
    ctx.fillText(`Score: ${score}`, 10, 25);

    if (gameOver) {
      ctx.fillStyle = "#f87171";
      ctx.font = "28px sans-serif";
      ctx.fillText("Game Over", 130, 200);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen text-white flex flex-col items-center pt-6 px-4">
        <h1 className="text-3xl font-bold text-purple-400 mb-3">🐤 Flappy Bird</h1>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-4 border-purple-500 rounded bg-gray-900"
          onClick={handleJump}
        />
        <p className="mt-4 text-gray-400">Click or press Space to flap after starting</p>
        <button
          onClick={startGame}
          className="mt-3 bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
        >
          {gameOver || !started ? "Start Game" : "Restart"}
        </button>
      </div>
    </>
  );
};

export default FlappyBird;
