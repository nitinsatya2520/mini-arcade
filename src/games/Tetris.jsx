import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";

const TetrisGame = () => {
  const [grid, setGrid] = useState([]);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [piecePos, setPiecePos] = useState({ x: 3, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [nextPiece, setNextPiece] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef();

  const GRID_WIDTH = 10;
  const GRID_HEIGHT = 20;

  const PIECES = [
    {
      shape: [[1, 1, 1, 1]],
      color: "#bb86fc",
    },
    {
      shape: [
        [1, 1],
        [1, 1],
      ],
      color: "#fbbc04",
    },
    {
      shape: [
        [0, 1, 0],
        [1, 1, 1],
      ],
      color: "#4285f4",
    },
    {
      shape: [
        [1, 0, 0],
        [1, 1, 1],
      ],
      color: "#ea4335",
    },
    {
      shape: [
        [0, 0, 1],
        [1, 1, 1],
      ],
      color: "#34a853",
    },
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
      ],
      color: "#ff4081",
    },
    {
      shape: [
        [0, 1, 1],
        [1, 1, 0],
      ],
      color: "#00bcd4",
    },
  ];

  const createGrid = () =>
    Array.from({ length: GRID_HEIGHT }, () =>
      Array(GRID_WIDTH).fill({ val: 0, color: "" })
    );

  const randomPiece = () => PIECES[Math.floor(Math.random() * PIECES.length)];

 const drawPiece = (grid, piece, pos) => {
  const newGrid = JSON.parse(JSON.stringify(grid));
  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) return; // skip empty cells

      const newY = pos.y + y;
      const newX = pos.x + x;

      // Ensure newY is valid and newGrid[newY] exists
      if (
        newY >= 0 &&
        newY < newGrid.length &&
        newX >= 0 &&
        newX < newGrid[newY].length
      ) {
        newGrid[newY][newX] = { val: 1, color: piece.color };
      }
    });
  });
  return newGrid;
};



  const isValid = (piece, pos, grid) => {
    return piece.shape.every((row, y) =>
      row.every((cell, x) => {
        if (!cell) return true;
        const newY = pos.y + y;
        const newX = pos.x + x;
        return (
          newY >= 0 &&
          newY < GRID_HEIGHT &&
          newX >= 0 &&
          newX < GRID_WIDTH &&
          !grid[newY][newX].val
        );
      })
    );
  };

  const mergePiece = (grid, piece, pos) => {
    return drawPiece(grid, piece, pos);
  };

  const clearLines = (grid) => {
    const newGrid = grid.filter((row) => row.some((cell) => !cell.val));
    const linesCleared = GRID_HEIGHT - newGrid.length;
    for (let i = 0; i < linesCleared; i++) {
      newGrid.unshift(Array(GRID_WIDTH).fill({ val: 0, color: "" }));
    }
    setScore((s) => s + linesCleared * 10);
    return newGrid;
  };

  const movePiece = (dx, dy) => {
    const newPos = { x: piecePos.x + dx, y: piecePos.y + dy };
    if (isValid(currentPiece, newPos, grid)) {
      setPiecePos(newPos);
    } else if (dy === 1) {
      const merged = mergePiece(grid, currentPiece, piecePos);
      const cleared = clearLines(merged);
      const next = nextPiece || randomPiece();
      const nextStartPos = { x: 3, y: 0 };
      if (!isValid(next, nextStartPos, cleared)) {
        setGameOver(true);
        setGameStarted(false);
        cancelAnimationFrame(gameLoopRef.current);
        return;
      }
      setGrid(cleared);
      setCurrentPiece(next);
      setNextPiece(randomPiece());
      setPiecePos(nextStartPos);
    }
  };

  const rotate = () => {
    const rotated = {
      ...currentPiece,
      shape: currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map((row) => row[i]).reverse()
      ),
    };
    if (isValid(rotated, piecePos, grid)) {
      setCurrentPiece(rotated);
    }
  };

  useEffect(() => {
    if (!gameStarted || !currentPiece) return;

    const tick = () => {
      movePiece(0, 1);
      gameLoopRef.current = setTimeout(tick, 500);
    };

    gameLoopRef.current = setTimeout(tick, 500);

    return () => clearTimeout(gameLoopRef.current);
  }, [currentPiece, piecePos, gameStarted]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!gameStarted) return;
      if (e.key === "ArrowLeft") movePiece(-1, 0);
      if (e.key === "ArrowRight") movePiece(1, 0);
      if (e.key === "ArrowDown") movePiece(0, 1);
      if (e.key === "ArrowUp") rotate();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentPiece, piecePos, gameStarted]);

  useEffect(() => {
    setGrid(createGrid());
    setCurrentPiece(randomPiece());
    setNextPiece(randomPiece());
    setPiecePos({ x: 3, y: 0 });
  }, []);

  const renderedGrid = drawPiece(grid, currentPiece || randomPiece(), piecePos);

  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen flex flex-col items-center text-white py-6">
        <h1 className="text-3xl font-bold text-purple-400 mb-4">🧩 Tetris Game</h1>

        {!gameStarted && !gameOver && (
          <button
            className="bg-purple-600 hover:bg-purple-800 px-4 py-2 rounded mb-4"
            onClick={() => {
              setGameStarted(true);
              setGameOver(false);
              setScore(0);
              setGrid(createGrid());
              const firstPiece = randomPiece();
              const next = randomPiece();
              setCurrentPiece(firstPiece);
              setNextPiece(next);
              setPiecePos({ x: 3, y: 0 });
            }}
          >
            Start Game
          </button>
        )}

        {gameOver && (
          <>
            <div className="text-red-400 mb-2 text-lg">Game Over! Final Score: {score}</div>
            <button
              className="bg-purple-600 hover:bg-purple-800 px-4 py-2 rounded mb-4"
              onClick={() => {
                setGameOver(false);
                setScore(0);
                setGrid(createGrid());
                const firstPiece = randomPiece();
                const next = randomPiece();
                setCurrentPiece(firstPiece);
                setNextPiece(next);
                setPiecePos({ x: 3, y: 0 });
                setGameStarted(true);
              }}
            >
              Restart
            </button>
          </>
        )}

        <div className="text-purple-300 mb-2">Score: {score}</div>

        <div
          className="grid border-2 border-purple-500"
          style={{
            gridTemplateColumns: `repeat(${GRID_WIDTH}, 20px)`,
            backgroundColor: "#1a1a1a",
            borderRadius: "8px",
          }}
        >
          {renderedGrid.flat().map((cell, i) => (
            <div
              key={i}
              style={{
                width: 20,
                height: 20,
                backgroundColor: cell.val ? cell.color : "black",
                border: cell.val ? "1px solid #333" : "1px solid #222",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default TetrisGame;
