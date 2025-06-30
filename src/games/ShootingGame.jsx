import React, { useRef, useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const ShootingGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const player = {
    x: 175,
    y: 370,
    width: 50,
    height: 20,
    speed: 5,
  };

  let bullets = [];
  let enemies = [];
  let lastEnemySpawn = 0;
  let keys = {};

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth > 500 ? 400 : window.innerWidth - 20);
    let height = (canvas.height = 400);
    let animationId;

    const spawnEnemy = () => {
      const x = Math.random() * (width - 30);
      enemies.push({ x, y: 0, width: 30, height: 20, speed: 1 + score / 10 });
    };

    const drawPlayer = () => {
      ctx.fillStyle = "#bb86fc";
      ctx.fillRect(player.x, player.y, player.width, player.height);
    };

    const drawBullets = () => {
      ctx.fillStyle = "white";
      bullets.forEach((b, index) => {
        b.y -= 7;
        ctx.fillRect(b.x, b.y, 5, 10);
        if (b.y < 0) bullets.splice(index, 1);
      });
    };

    const drawEnemies = () => {
      ctx.fillStyle = "red";
      enemies.forEach((e, i) => {
        e.y += e.speed;
        ctx.fillRect(e.x, e.y, e.width, e.height);

        // Collision with player
        if (
          e.y + e.height >= player.y &&
          e.x < player.x + player.width &&
          e.x + e.width > player.x
        ) {
          cancelAnimationFrame(animationId);
          setGameOver(true);
        }
      });
    };

    const checkCollisions = () => {
      bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
          if (
            b.x < e.x + e.width &&
            b.x + 5 > e.x &&
            b.y < e.y + e.height &&
            b.y + 10 > e.y
          ) {
            bullets.splice(bi, 1);
            enemies.splice(ei, 1);
            setScore(prev => prev + 1);
          }
        });
      });
    };

    const update = (timestamp) => {
      if (isPaused || gameOver) return;

      ctx.clearRect(0, 0, width, height);

      if (timestamp - lastEnemySpawn > 1000 - Math.min(score * 20, 800)) {
        spawnEnemy();
        lastEnemySpawn = timestamp;
      }

      if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
      if (keys["ArrowRight"] && player.x + player.width < width)
        player.x += player.speed;

      drawPlayer();
      drawBullets();
      drawEnemies();
      checkCollisions();

      animationId = requestAnimationFrame(update);
    };

    const shoot = () => {
      bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
      });
    };

    const keyDown = (e) => {
      keys[e.key] = true;
      if (e.key === " " && !gameOver && !isPaused) shoot();
    };

    const keyUp = (e) => {
      keys[e.key] = false;
    };

    const touchMove = (e) => {
      player.x = e.touches[0].clientX - player.width / 2;
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > width) player.x = width - player.width;
    };

    const touchShoot = () => {
      if (!gameOver && !isPaused) shoot();
    };

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    canvas.addEventListener("touchmove", touchMove);
    canvas.addEventListener("touchstart", touchShoot);

    animationId = requestAnimationFrame(update);

    return () => {
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("keyup", keyUp);
      canvas.removeEventListener("touchmove", touchMove);
      canvas.removeEventListener("touchstart", touchShoot);
      cancelAnimationFrame(animationId);
    };
  }, [score, gameOver, isPaused]);

  const restart = () => {
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    window.location.reload();
  };

  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white py-10">
        <h1 className="text-3xl text-purple-400 font-bold mb-2">🔫 Shooting Game</h1>
        <p className="text-purple-300 mb-4">Score: {score}</p>
        {gameOver && (
          <div className="text-red-400 mb-4 text-lg">Game Over! Final Score: {score}</div>
        )}
        <div className="flex gap-4 mb-4">
          <button
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-700 px-4 py-2 rounded"
            onClick={restart}
          >
            Restart
          </button>
        </div>
        <canvas
          ref={canvasRef}
          style={{
            border: "2px solid #bb86fc",
            borderRadius: "10px",
            background: "#1e1e1e",
          }}
        />
      </div>
    </>
  );
};

export default ShootingGame;
