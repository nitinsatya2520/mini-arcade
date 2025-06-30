import React, { useRef, useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const SpaceInvaders = () => {
  const canvasRef = useRef(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [touchDir, setTouchDir] = useState("");

  const player = useRef({ x: 210, y: 270, width: 40, height: 20 });
  const bullets = useRef([]);
  const invaders = useRef([]);
  const direction = useRef(1);
  const intervalRef = useRef(null);

  const canvasWidth = 480;
  const canvasHeight = 320;

  const addInvaderRow = () => {
  const cols = 8;
  const invaderWidth = 30;
  const invaderHeight = 20;
  const spacingX = 25;
  const spacingY = 20;
  const topY = 20;

  // Push existing invaders down
  invaders.current.forEach((invader) => {
    invader.y += invaderHeight + spacingY;
  });

  // Add new row at top
  for (let c = 0; c < cols; c++) {
    invaders.current.push({
      x: c * (invaderWidth + spacingX) + 20,
      y: topY,
      width: invaderWidth,
      height: invaderHeight,
      alive: true,
    });
  }
};


  const drawPlayer = (ctx) => {
    ctx.fillStyle = "#bb86fc";
    ctx.fillRect(player.current.x, player.current.y, player.current.width, player.current.height);
  };

  const drawBullets = (ctx) => {
    ctx.fillStyle = "#ffffff";
    bullets.current.forEach((bullet) => {
      ctx.fillRect(bullet.x, bullet.y, 4, 10);
    });
  };

  const drawInvaders = (ctx) => {
    ctx.fillStyle = "#4f46e5";
    invaders.current.forEach((invader) => {
      if (invader.alive) {
        ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
      }
    });
  };

  const updateBullets = () => {
    bullets.current = bullets.current.filter((b) => b.y > 0);
    bullets.current.forEach((b) => (b.y -= 4));
  };

  const updateInvaders = () => {
    let shiftDown = false;

    for (let invader of invaders.current) {
      if (!invader.alive) continue;
      invader.x += direction.current * 1;
      if (invader.x <= 0 || invader.x + invader.width >= canvasWidth) {
        shiftDown = true;
      }
    }

    if (shiftDown) {
      direction.current *= -1;
      for (let invader of invaders.current) {
        invader.y += 10;
      }
    }
  };

  const checkCollisions = () => {
    bullets.current.forEach((bullet) => {
      invaders.current.forEach((invader) => {
        if (
          invader.alive &&
          bullet.x < invader.x + invader.width &&
          bullet.x + 4 > invader.x &&
          bullet.y < invader.y + invader.height &&
          bullet.y + 10 > invader.y
        ) {
          invader.alive = false;
          bullet.y = -10;
          setScore((prev) => prev + 10);
        }
      });
    });
  };

  const draw = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawPlayer(ctx);
    drawBullets(ctx);
    drawInvaders(ctx);

    updateBullets();
    updateInvaders();
    checkCollisions();

    if (touchDir === "left" && player.current.x > 0) player.current.x -= 3;
    if (touchDir === "right" && player.current.x + player.current.width < canvasWidth)
      player.current.x += 3;
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft" && player.current.x > 0) player.current.x -= 10;
    if (e.key === "ArrowRight" && player.current.x + player.current.width < canvasWidth)
      player.current.x += 10;
    if (e.key === " " || e.key === "Spacebar") {
      bullets.current.push({
        x: player.current.x + player.current.width / 2 - 2,
        y: player.current.y,
      });
    }
  };

  const fireBullet = () => {
    bullets.current.push({
      x: player.current.x + player.current.width / 2 - 2,
      y: player.current.y,
    });
  };

  const startGame = () => {
    player.current = { x: 210, y: 270, width: 40, height: 20 };
    bullets.current = [];
    invaders.current = [];
    setScore(0);
    direction.current = 1;

    addInvaderRow();
    if (window.rowSpawner) clearInterval(window.rowSpawner);
    window.rowSpawner = setInterval(addInvaderRow, 10000);

    setGameRunning(true);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(draw, 16);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(window.rowSpawner);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white flex flex-col items-center pt-8 px-4">
        <h1 className="text-3xl font-bold text-purple-400 mb-4">👾 Space Invaders</h1>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border-4 border-purple-500 rounded-lg bg-gray-900"
        />
        <div className="mt-4 flex gap-2">
          <button onClick={startGame} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded shadow">
            Start / Restart
          </button>
        </div>
        <div className="mt-4 flex gap-4">
          <button onMouseDown={() => setTouchDir("left")} onMouseUp={() => setTouchDir("")} className="px-4 py-2 bg-purple-500 rounded">
            ◀️
          </button>
          <button onClick={fireBullet} className="px-4 py-2 bg-purple-700 rounded">
            🔫
          </button>
          <button onMouseDown={() => setTouchDir("right")} onMouseUp={() => setTouchDir("")} className="px-4 py-2 bg-purple-500 rounded">
            ▶️
          </button>
        </div>
        <div className="mt-4 text-lg">
          Score: <span className="text-green-400">{score}</span>
        </div>
      </div>
    </>
  );
};

export default SpaceInvaders;
