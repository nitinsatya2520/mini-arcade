import React, { useState } from "react";
import Navbar from "../components/Navbar";
const ROWS = 8;
const COLS = 8;
const MAX_MIRRORS = 3;


const initGrid = () => {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(""));
  grid[7][0] = "S"; // Start
  grid[0][7] = "T"; // Target
  return grid;
};

const LaserMirrorMaze = () => {
  const [grid, setGrid] = useState(initGrid);
  const [laserPath, setLaserPath] = useState([]);
  const [fired, setFired] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);
  const [mirrorCount, setMirrorCount] = useState(0);
  const [selectedMirror, setSelectedMirror] = useState("/");


  const directions = {
    right: [0, 1],
    left: [0, -1],
    up: [-1, 0],
    down: [1, 0]
  };

  const handleCellClick = (r, c) => {
  if (fired || grid[r][c] === "S" || grid[r][c] === "T") return;

  if (grid[r][c] === "/" || grid[r][c] === "\\") {
    setMirrorCount((prev) => prev - 1);
    updateGrid(r, c, "");
  } else if (mirrorCount < MAX_MIRRORS) {
    updateGrid(r, c, selectedMirror);
    setMirrorCount((prev) => prev + 1);
  }
};


  const updateGrid = (r, c, value) => {
    const newGrid = grid.map((row, i) => [...row]);
    newGrid[r][c] = value;
    setGrid(newGrid);
  };

  const reflect = (dir, mirror) => {
    if (mirror === "/") {
      return {
        right: "up",
        left: "down",
        up: "right",
        down: "left"
      }[dir];
    } else if (mirror === "\\") {
      return {
        right: "down",
        left: "up",
        up: "left",
        down: "right"
      }[dir];
    }
    return dir;
  };

  const fireLaser = () => {
    if (fired || paused) return;

    let path = [];
    let r = 7,
      c = 0,
      dir = "right";

    while (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      path.push([r, c]);
      const cell = grid[r][c];
      if (cell === "/") dir = reflect(dir, "/");
      else if (cell === "\\") dir = reflect(dir, "\\");

      const [dr, dc] = directions[dir];
      r += dr;
      c += dc;

      if (grid[r]?.[c] === "T") {
        path.push([r, c]);
        setLaserPath(path);
        setHasWon(true);
        setFired(true);
        return;
      }
    }

    setLaserPath(path);
    setHasLost(true);
    setFired(true);
  };

  const resetGame = () => {
    setGrid(initGrid());
    setLaserPath([]);
    setFired(false);
    setPaused(false);
    setHasWon(false);
    setHasLost(false);
    setMirrorCount(0);
  };

  const togglePause = () => {
    setPaused((prev) => !prev);
  };

  const renderCell = (r, c) => {
    const cell = grid[r][c];
    const isPath = laserPath.some(([lr, lc]) => lr === r && lc === c);
    const bgColor = cell === "S"
      ? "bg-green-600"
      : cell === "T"
      ? "bg-red-600"
      : isPath
      ? "bg-yellow-300"
      : "bg-gray-800";

    return (
      <div
        key={`${r}-${c}`}
        onClick={() => handleCellClick(r, c)}
        className={`w-10 h-10 border border-gray-600 flex items-center justify-center text-xl font-bold cursor-pointer ${bgColor} text-white`}
      >
        {cell}
      </div>
    );
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Laser Mirror Maze</h1>

      <div className="grid grid-cols-8 gap-1 mb-6">
        {grid.map((row, r) => row.map((_, c) => renderCell(r, c)))}
      </div>
      <div className="flex gap-4 mb-4">
  <button
    onClick={() => setSelectedMirror("/")}
    className={`px-4 py-2 rounded ${
      selectedMirror === "/" ? "bg-purple-700" : "bg-purple-600"
    } hover:bg-purple-800`}
  >
    /
  </button>
  <button
    onClick={() => setSelectedMirror("\\")}
    className={`px-4 py-2 rounded ${
      selectedMirror === "\\" ? "bg-purple-700" : "bg-purple-600"
    } hover:bg-purple-800`}
  >
    \
  </button>
</div>
      <div className="flex gap-4 mb-4">
        <button
          onClick={fireLaser}
          disabled={fired || paused}
          className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-800"
        >
          Fire Laser
        </button>
        <button
          onClick={togglePause}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-800"
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-800"
        >
          Reset
        </button>
      </div>

      <div className="text-yellow-400 font-semibold mb-2">
        Mirrors used: {mirrorCount} / {MAX_MIRRORS}
      </div>

      {hasWon && (
        <div className="text-green-400 text-2xl font-bold animate-pulse">
          🎉 You Won!
        </div>
      )}
      {hasLost && (
        <div className="text-red-400 text-xl font-bold animate-pulse">
          💥 You Missed!
        </div>
      )}
    </div></>
  );
};

export default LaserMirrorMaze;
