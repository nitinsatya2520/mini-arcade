import React, { useRef, useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const BrickBreaker = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);

  const canvasWidth = 480;
  const canvasHeight = 320;
  const paddleHeight = 10;
  const paddleWidth = 75;
  const ballRadius = 8;
  const brickRowCount = 4;
  const brickColumnCount = 6;
  const brickWidth = 60;
  const brickHeight = 15;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;

  const x = useRef(canvasWidth / 2);
  const y = useRef(canvasHeight - 30);
  const dx = useRef(2);
  const dy = useRef(-2);
  const paddleX = useRef((canvasWidth - paddleWidth) / 2);
  const rightPressed = useRef(false);
  const leftPressed = useRef(false);
  const intervalRef = useRef(null);

  const bricks = useRef([]);

  useEffect(() => {
    // Initialize bricks
    const newBricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      newBricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        newBricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    bricks.current = newBricks;
  }, []);

  const keyDownHandler = (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed.current = true;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed.current = true;
  };

  const keyUpHandler = (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed.current = false;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed.current = false;
  };

  const drawBall = (ctx) => {
    ctx.beginPath();
    ctx.arc(x.current, y.current, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#bb86fc";
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx) => {
    ctx.beginPath();
    ctx.rect(paddleX.current, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();
  };

  const drawBricks = (ctx) => {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks.current[c][r];
        if (b.status === 1) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          b.x = brickX;
          b.y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#4f46e5";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  };

  const collisionDetection = () => {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks.current[c][r];
        if (b.status === 1) {
          if (
            x.current > b.x &&
            x.current < b.x + brickWidth &&
            y.current > b.y &&
            y.current < b.y + brickHeight
          ) {
            dy.current = -dy.current;
            b.status = 0;
            setScore((prev) => prev + 1);
          }
        }
      }
    }
  };

  const draw = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawBricks(ctx);
    drawBall(ctx);
    drawPaddle(ctx);
    collisionDetection();

    if (
      x.current + dx.current > canvasWidth - ballRadius ||
      x.current + dx.current < ballRadius
    ) {
      dx.current = -dx.current;
    }
    if (y.current + dy.current < ballRadius) {
      dy.current = -dy.current;
    } else if (y.current + dy.current > canvasHeight - ballRadius) {
      if (
        x.current > paddleX.current &&
        x.current < paddleX.current + paddleWidth
      ) {
        dy.current = -dy.current;
      } else {
        clearInterval(intervalRef.current);
        setGameRunning(false);
      }
    }

    if (rightPressed.current && paddleX.current < canvasWidth - paddleWidth) {
      paddleX.current += 5;
    } else if (leftPressed.current && paddleX.current > 0) {
      paddleX.current -= 5;
    }

    x.current += dx.current;
    y.current += dy.current;
  };

  const startGame = () => {
    x.current = canvasWidth / 2;
    y.current = canvasHeight - 30;
    dx.current = 2;
    dy.current = -2;
    paddleX.current = (canvasWidth - paddleWidth) / 2;
    setScore(0);

    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        bricks.current[c][r].status = 1;
      }
    }

    setGameRunning(true);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(draw, 10);
  };

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white flex flex-col items-center pt-8 px-4">
        <h1 className="text-3xl font-bold text-purple-400 mb-4">🧱 Brick Breaker</h1>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border-4 border-purple-500 rounded-lg bg-gray-900"
        />
        <div className="mt-4 flex gap-4">
          <button
            onClick={startGame}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded shadow"
          >
            Start / Restart
          </button>
        </div>
        <div className="mt-4 text-lg">
          <p>
            Score: <span className="text-green-400">{score}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default BrickBreaker;
