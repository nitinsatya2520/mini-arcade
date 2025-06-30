import React, { useRef, useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const BreakTheWall = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = canvas.width = window.innerWidth > 500 ? 400 : window.innerWidth - 20;
    const height = canvas.height = 500;

    let paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX = (width - paddleWidth) / 2;

    let ballRadius = 8;
    let x = width / 2;
    let y = height - 30;
    let dx = 2;
    let dy = -2;

    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 5;
    const brickColumnCount = 6;
    const brickWidth = 60;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 15;

    let bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#bb86fc";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#bb86fc";
      ctx.fill();
      ctx.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      drawBricks();
      drawBall();
      drawPaddle();

      // Brick collision
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          let b = bricks[c][r];
          if (b.status === 1) {
            if (
              x > b.x &&
              x < b.x + brickWidth &&
              y > b.y &&
              y < b.y + brickHeight
            ) {
              dy = -dy;
              b.status = 0;
              setScore((prev) => prev + 1);
              if (score + 1 === brickRowCount * brickColumnCount) {
                setWin(true);
                return;
              }
            }
          }
        }
      }

      // Wall collision
      if (x + dx > width - ballRadius || x + dx < ballRadius) dx = -dx;
      if (y + dy < ballRadius) dy = -dy;
      else if (y + dy > height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
        else {
          setGameOver(true);
          return;
        }
      }

      x += dx;
      y += dy;

      if (rightPressed && paddleX < width - paddleWidth) paddleX += 5;
      else if (leftPressed && paddleX > 0) paddleX -= 5;

      requestAnimationFrame(draw);
    };

    const keyDownHandler = (e) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    };

    const keyUpHandler = (e) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    };

    const touchMoveHandler = (e) => {
      const touchX = e.touches[0].clientX;
      paddleX = touchX - paddleWidth / 2;
      if (paddleX < 0) paddleX = 0;
      if (paddleX > width - paddleWidth) paddleX = width - paddleWidth;
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    canvas.addEventListener("touchmove", touchMoveHandler);

    draw();

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      canvas.removeEventListener("touchmove", touchMoveHandler);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white py-10">
        <h1 className="text-3xl text-purple-400 mb-4 font-bold">🧱 Break the Wall</h1>
        {gameOver && <div className="text-red-400 mb-2 text-lg">Game Over! Final Score: {score}</div>}
        {win && <div className="text-green-400 mb-2 text-lg">You Win! Score: {score}</div>}
        {!gameOver && !win && (
          <div className="mb-4 text-purple-300">Score: {score}</div>
        )}
        <canvas
          ref={canvasRef}
          style={{
            border: "2px solid #bb86fc",
            borderRadius: "12px",
            background: "#1a1a1a",
          }}
        ></canvas>
      </div>
    </>
  );
};

export default BreakTheWall;
