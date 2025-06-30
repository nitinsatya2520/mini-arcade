import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Games from "./pages/Games";
import About from "./pages/About";
import Preloader from "./components/Preloader";

// Game Components
import SnakeGame from "./games/SnakeGame";
import BrickBreaker from "./games/BrickBreaker";
import FlappyBird from "./games/FlappyBird";
import RockPaperScissors from "./games/RockPaperScissors";
import Game2048 from "./games/Game2048";
import CarDodger from "./games/CarDodger";
import MemoryGame from "./games/MemoryGame";
import MemoryGame2 from "./games/MemoryGame2";
import SpaceInvaders from "./games/SpaceInvaders";
import WhackAMole from "./games/WhackAMole";
import TicTacToe from "./games/TicTacToe";
import PongGame from "./games/PongGame";
import Tetris from "./games/Tetris";
import ShootingGame from "./games/ShootingGame";
import BreakTheWall from "./games/BreakTheWall";
import HelicopterGame from "./games/HelicopterGame";
import LaserMazeGame from "./games/LaserMazeGame";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/about" element={<About />} />

        {/* Game Routes */}
        <Route path="/games/snake" element={<SnakeGame />} />
        <Route path="/games/brick-breaker" element={<BrickBreaker />} />
        <Route path="/games/flappy-bird" element={<FlappyBird />} />
        <Route path="/games/rock-paper-scissors" element={<RockPaperScissors />} />
        <Route path="/games/2048" element={<Game2048 />} />
        <Route path="/games/car-dodger" element={<CarDodger />} />
        <Route path="/games/memory-game" element={<MemoryGame />} />
        <Route path="/games/memory-game-2" element={<MemoryGame2 />} />
        <Route path="/games/space-invaders" element={<SpaceInvaders />} />
        <Route path="/games/whack-a-mole" element={<WhackAMole />} />
        <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/games/pong" element={<PongGame />} />
        <Route path="/games/tetris" element={<Tetris />} />
        <Route path="/games/shooting-game" element={<ShootingGame />} />
        <Route path="/games/break-the-wall" element={<BreakTheWall />} />
        <Route path="/games/helicopter-game" element={<HelicopterGame />} />
        <Route path="/games/laser-maze" element={<LaserMazeGame />} />
      </Routes>
    </Router>
  );
}
