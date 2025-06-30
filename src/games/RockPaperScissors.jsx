import React, { useState } from "react";
import Navbar from "../components/Navbar";

const options = ["rock", "paper", "scissors"];

const getResult = (player, computer) => {
  if (player === computer) return "It's a Tie!";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    return "You Win!";
  }
  return "You Lose!";
};

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState("");
  const [score, setScore] = useState({ player: 0, computer: 0 });

  const play = (choice) => {
    const compChoice = options[Math.floor(Math.random() * 3)];
    const outcome = getResult(choice, compChoice);

    setPlayerChoice(choice);
    setComputerChoice(compChoice);
    setResult(outcome);

    if (outcome === "You Win!") setScore({ ...score, player: score.player + 1 });
    if (outcome === "You Lose!") setScore({ ...score, computer: score.computer + 1 });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-purple-400 mb-6">✊ Rock Paper Scissors ✌️</h1>
        <div className="flex gap-6 mb-4">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => play(opt)}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded text-lg capitalize"
            >
              {opt}
            </button>
          ))}
        </div>

        {playerChoice && (
          <div className="text-center mt-4">
            <p className="mb-2">
              You chose: <span className="text-blue-400">{playerChoice}</span>
            </p>
            <p className="mb-2">
              Computer chose: <span className="text-red-400">{computerChoice}</span>
            </p>
            <p className="text-xl font-bold text-green-400 mt-2">{result}</p>
          </div>
        )}

        <div className="mt-6 text-lg">
          <p>🎯 Your Score: <span className="text-blue-300">{score.player}</span></p>
          <p>🤖 Computer Score: <span className="text-red-300">{score.computer}</span></p>
        </div>
      </div>
    </>
  );
};

export default RockPaperScissors;
