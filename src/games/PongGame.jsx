import React, { useRef, useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const PongGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const paddleWidth = 100;
  const paddleHeight = 10;
  const ballRadius = 7;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth > 500 ? 400 : window.innerWidth - 20;
    let height = canvas.height = 400;

    let paddleX = (width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;

    let x = width / 2;
    let y = height - 30;
    let dx = 1.5;  // slower speed
    let dy = -1.5;

    let animationFrameId;

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#bb86fc";
      ctx.fill();
      ctx.closePath();
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.closePath();
    };

    const draw = () => {
      if (paused || gameOver) return;

      ctx.clearRect(0, 0, width, height);
      drawPaddle();
      drawBall();

      if (x + dx > width - ballRadius || x + dx < ballRadius) dx = -dx;
      if (y + dy < ballRadius) dy = -dy;
      else if (y + dy > height - paddleHeight) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
          setScore(prev => prev + 1);
        } else {
          setGameOver(true);
          cancelAnimationFrame(animationFrameId);
          return;
        }
      }

      x += dx;
      y += dy;

      if (rightPressed && paddleX < width - paddleWidth) paddleX += 5;
      else if (leftPressed && paddleX > 0) paddleX -= 5;

      animationFrameId = requestAnimationFrame(draw);
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

    draw(); // start drawing loop

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      canvas.removeEventListener("touchmove", touchMoveHandler);
    };
  }, [paused, gameOver]);

  const togglePause = () => {
    setPaused(prev => !prev);
  };

  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white py-10">
        <h1 className="text-3xl text-purple-400 mb-4 font-bold">🏓 Pong Game</h1>

        {gameOver ? (
          <div className="text-red-400 mb-2 text-lg">
            Game Over! Final Score: {score}
          </div>
        ) : (
          <div className="mb-2 text-purple-300">Score: {score}</div>
        )}

        <button
          onClick={togglePause}
          className="mb-4 bg-purple-700 hover:bg-purple-600 text-white py-2 px-5 rounded-xl transition-all"
        >
          {paused ? "Resume" : "Pause"}
        </button>

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

export default PongGame;
