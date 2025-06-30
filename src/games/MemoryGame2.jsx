import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const generateShuffledCards = () => {
  const symbols = ["🍎", "🍌", "🍇", "🍓", "🍒", "🥝", "🍍", "🍉"];
  const duplicated = [...symbols, ...symbols];
  return duplicated
    .map((symbol) => ({ symbol, id: Math.random(), flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5);
};

const MemoryGame2 = () => {
  const [cards, setCards] = useState(generateShuffledCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (first.symbol === second.symbol) {
        setCards((prev) =>
          prev.map((card) =>
            card.symbol === first.symbol ? { ...card, matched: true } : card
          )
        );
        setMatchedCount((count) => count + 1);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first.id || card.id === second.id
                ? { ...card, flipped: false }
                : card
            )
          );
        }, 800);
      }
      setTimeout(() => setFlippedCards([]), 800);
      setMoves((m) => m + 1);
    }
  }, [flippedCards]);

  const handleFlip = (card) => {
    if (flippedCards.length === 2 || card.flipped || card.matched) return;

    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, flipped: true } : c
    );
    setCards(updatedCards);
    setFlippedCards([...flippedCards, card]);
  };

  const handleRestart = () => {
    setCards(generateShuffledCards());
    setFlippedCards([]);
    setMoves(0);
    setMatchedCount(0);
  };

  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen text-white flex flex-col items-center py-6 px-4">
        <h1 className="text-3xl font-bold text-green-400 mb-4">🧠 Memory Flip Cards</h1>
        <p className="text-gray-400 mb-2">Match all the pairs!</p>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleFlip(card)}
              className={`w-16 h-20 flex items-center justify-center text-2xl rounded-lg cursor-pointer transition-all duration-300 ${
                card.flipped || card.matched ? "bg-white text-black" : "bg-green-700"
              }`}
            >
              {card.flipped || card.matched ? card.symbol : "❓"}
            </div>
          ))}
        </div>
        <p className="text-gray-300 mb-2">Moves: {moves}</p>
        <button
          onClick={handleRestart}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Restart Game
        </button>
        {matchedCount === 8 && (
          <p className="mt-4 text-yellow-400 font-bold text-lg">🎉 You Win!</p>
        )}
      </div>
    </>
  );
};

export default MemoryGame2;
