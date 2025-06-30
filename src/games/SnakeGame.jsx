import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";

const gridSize = 20;
const canvasSize = 400;

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 8, y: 8 }]);
  const [food, setFood] = useState({ x: 10, y: 10 });
  const [dir, setDir] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("highScore")) || 0);
  const [gameRunning, setGameRunning] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (dir.y === 0) setDir({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (dir.y === 0) setDir({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (dir.x === 0) setDir({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (dir.x === 0) setDir({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dir]);

  useEffect(() => {
    if (!gameRunning) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        head.x += dir.x;
        head.y += dir.y;

        // Collision detection
        if (
          head.x < 0 || head.x >= canvasSize / gridSize ||
          head.y < 0 || head.y >= canvasSize / gridSize ||
          prevSnake.some((s) => s.x === head.x && s.y === head.y)
        ) {
          setGameRunning(false);
          setDir({ x: 0, y: 0 });
          setHighScore((prev) => {
            const newHigh = Math.max(prev, score);
            localStorage.setItem("highScore", newHigh);
            return newHigh;
          });
          return [{ x: 8, y: 8 }];
        }

        let newSnake = [head, ...prevSnake];

        if (head.x === food.x && head.y === food.y) {
          setScore((prev) => prev + 1);
          placeFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [dir, food, gameRunning]);

  useEffect(() => {
    draw();
  }, [snake, food]);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw food
    ctx.fillStyle = "#bb86fc";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Draw snake
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#ffffff" : "#4f4f4f";
      ctx.fillRect(s.x * gridSize, s.y * gridSize, gridSize, gridSize);
    });
  };

  const placeFood = (snakePos) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)),
        y: Math.floor(Math.random() * (canvasSize / gridSize)),
      };
    } while (snakePos.some((s) => s.x === newFood.x && s.y === newFood.y));
    setFood(newFood);
  };

  const startGame = () => {
    setScore(0);
    setSnake([{ x: 8, y: 8 }]);
    setDir({ x: 0, y: -1 });
    setGameRunning(true);
    placeFood([{ x: 8, y: 8 }]);
  };

  const pauseGame = () => {
    setGameRunning(false);
  };

  const resumeGame = () => {
    if (dir.x !== 0 || dir.y !== 0) {
      setGameRunning(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white flex flex-col items-center pt-8 px-4">
        <h1 className="text-3xl font-bold text-purple-400 mb-4">🐍 Snake Game</h1>
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="border-4 border-purple-500 rounded-lg shadow-lg bg-gray-900"
        />
        <div className="mt-4 flex gap-4 flex-wrap justify-center">
          <button onClick={startGame} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded shadow">
            Start
          </button>
          <button onClick={pauseGame} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded shadow">
            Pause
          </button>
          <button onClick={resumeGame} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow">
            Resume
          </button>
        </div>
        <div className="mt-4 text-lg">
          <p>Score: <span className="text-green-400">{score}</span></p>
          <p>High Score: <span className="text-blue-400">{highScore}</span></p>
        </div>
      </div>
    </>
  );
};

export default SnakeGame;
