import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const emojiList = ["🐶", "🐱", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁"];

const shuffleArray = (arr) => {
  const newArr = [...arr, ...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr.map((item, index) => ({ emoji: item, id: index, flipped: false, matched: false }));
};

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].emoji === cards[second].emoji) {
        setCards((prev) => {
          const updated = [...prev];
          updated[first].matched = true;
          updated[second].matched = true;
          return updated;
        });
        setMatchedPairs((p) => p + 1);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[first].flipped = false;
            updated[second].flipped = false;
            return updated;
          });
          setFlippedCards([]);
        }, 1000);
      }
      setMoves((m) => m + 1);
    }
  }, [flippedCards, cards]);

  const handleClick = (index) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;

    const updatedCards = [...cards];
    updatedCards[index].flipped = true;
    setCards(updatedCards);
    setFlippedCards([...flippedCards, index]);
  };

  const resetGame = () => {
    setCards(shuffleArray(emojiList));
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white flex flex-col items-center pt-6 px-4">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">🧠 Memory Flip Cards</h1>

        <div className="grid grid-cols-4 gap-3">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`w-20 h-24 flex items-center justify-center text-3xl border-2 rounded-lg cursor-pointer transition-all duration-300 transform ${
                card.flipped || card.matched ? "bg-white text-black" : "bg-purple-600"
              }`}
              onClick={() => handleClick(index)}
            >
              {(card.flipped || card.matched) ? card.emoji : ""}
            </div>
          ))}
        </div>

        <div className="mt-6 text-lg text-gray-300">
          <p>Moves: <span className="text-white font-semibold">{moves}</span></p>
          <p>Matched: <span className="text-white font-semibold">{matchedPairs} / 8</span></p>
        </div>

        <button
          onClick={resetGame}
          className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
        >
          Restart Game
        </button>

        {matchedPairs === 8 && (
          <p className="mt-4 text-green-400 font-bold text-xl">🎉 You won in {moves} moves!</p>
        )}
      </div>
    </>
  );
};

export default MemoryGame;
