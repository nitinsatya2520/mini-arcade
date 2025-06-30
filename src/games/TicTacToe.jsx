import React, { useState } from "react";
import Navbar from "../components/Navbar";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6],            // diagonals
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    const win = calculateWinner(newBoard);
    setBoard(newBoard);
    setIsXNext(!isXNext);
    if (win) setWinner(win);
  };

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold text-purple-400 mb-6">⭕ Tic Tac Toe ❌</h1>

        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, i) => (
            <button
              key={i}
              className="w-24 h-24 text-4xl rounded bg-gray-900 hover:bg-gray-800 text-purple-300 transition-all"
              onClick={() => handleClick(i)}
            >
              {cell}
            </button>
          ))}
        </div>

        <div className="mt-6 text-lg">
          {winner ? (
            <p className="text-green-400">🎉 Winner: {winner}</p>
          ) : (
            <p className="text-blue-300">Next Turn: {isXNext ? "X" : "O"}</p>
          )}
        </div>

        <button
          onClick={restartGame}
          className="mt-4 px-5 py-2 rounded bg-purple-600 hover:bg-purple-700"
        >
          Restart Game
        </button>
      </div>
    </>
  );
};

export default TicTacToe;
