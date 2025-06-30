import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const SIZE = 4;
const generateEmptyBoard = () => Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
const getRandomInt = (max) => Math.floor(Math.random() * max);

const placeRandom = (board) => {
  const empty = [];
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) empty.push([i, j]);
    });
  });
  if (empty.length === 0) return board;
  const [i, j] = empty[getRandomInt(empty.length)];
  board[i][j] = Math.random() < 0.9 ? 2 : 4;
  return board;
};

const cloneBoard = (board) => board.map((row) => row.slice());

const moveLeft = (board) => {
  const newBoard = board.map((row) => {
    const filtered = row.filter((val) => val !== 0);
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        filtered[i + 1] = 0;
      }
    }
    const compacted = filtered.filter((val) => val !== 0);
    while (compacted.length < SIZE) compacted.push(0);
    return compacted;
  });
  return newBoard;
};

const rotateRight = (board) => board[0].map((_, i) => board.map(row => row[i]).reverse());
const rotateLeft = (board) => board[0].map((_, i) => board.map(row => row[row.length - 1 - i]));

const move = (board, direction) => {
  let rotated;
  if (direction === "left") return moveLeft(board);
  if (direction === "right") rotated = rotateRight(rotateRight(board));
  if (direction === "up") rotated = rotateLeft(board);
  if (direction === "down") rotated = rotateRight(board);

  const moved = moveLeft(rotated);

  if (direction === "right") return rotateRight(rotateRight(moved));
  if (direction === "up") return rotateRight(moved);
  if (direction === "down") return rotateLeft(moved);
};

const isBoardChanged = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

const Game2048 = () => {
  const [board, setBoard] = useState(placeRandom(placeRandom(generateEmptyBoard())));
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;
      const directions = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
      const dir = directions[e.key];
      if (!dir) return;
      const newBoard = move(cloneBoard(board), dir);
      if (isBoardChanged(board, newBoard)) {
        setBoard(placeRandom(newBoard));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [board, gameOver]);

  useEffect(() => {
    const hasMoves = () => {
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (board[i][j] === 0) return true;
          if (i < SIZE - 1 && board[i][j] === board[i + 1][j]) return true;
          if (j < SIZE - 1 && board[i][j] === board[i][j + 1]) return true;
        }
      }
      return false;
    };
    setGameOver(!hasMoves());
  }, [board]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl text-purple-400 font-bold mb-6">2048 Game</h1>
        <div className="grid grid-cols-4 gap-2 bg-gray-800 p-4 rounded">
          {board.flat().map((num, idx) => (
            <div
              key={idx}
              className={`w-16 h-16 flex items-center justify-center font-bold text-lg rounded transition-all duration-300 ${
                num === 0 ? "bg-gray-700" : "bg-purple-600 text-white"
              }`}
            >
              {num !== 0 ? num : ""}
            </div>
          ))}
        </div>
        {gameOver && <p className="mt-4 text-red-400 font-semibold text-lg">Game Over!</p>}
      </div>
    </>
  );
};

export default Game2048;
