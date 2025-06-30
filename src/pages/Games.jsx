import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const games = [
  { path: "/games/snake", label: "🐍 Snake Game", img: "/images/snake.png" },
  { path: "/games/brick-breaker", label: "🧱 Brick Breaker", img: "/images/brick-breaker.png" },
  { path: "/games/flappy-bird", label: "🐤 Flappy Bird", img: "/images/flappy-bird.png" },
  { path: "/games/rock-paper-scissors", label: "✊ Rock Paper Scissors", img: "/images/rps.png" },
  { path: "/games/2048", label: "🧠 2048", img: "/images/2048.png" },
  { path: "/games/car-dodger", label: "🚗 Car Dodger", img: "/images/car-dodger.png" },
  { path: "/games/memory-game", label: "🃏 Memory Game", img: "/images/memory.png" },
  { path: "/games/memory-game-2", label: "🧠 Memory Game 2", img: "/images/memory-game-2.png" },
  { path: "/games/space-invaders", label: "🚀 Space Invaders", img: "/images/space-invaders.png" },
  { path: "/games/whack-a-mole", label: "🕷️ Whack-a-Mole", img: "/images/whack-a-mole.png" },
  { path: "/games/tic-tac-toe", label: "🕹️ Tic Tac Toe", img: "/images/tic-tac-toe.png" },
  { path: "/games/pong", label: "🏓 Pong", img: "/images/pong.png" },
  { path: "/games/tetris", label: "🧱 Tetris", img: "/images/tetris.png" },
  { path: "/games/shooting-game", label: "🔫 Shooting Game", img: "/images/shooting.png" },
  { path: "/games/break-the-wall", label: "🧱 Break the Wall", img: "/images/break-the-wall.png" },
  { path: "/games/helicopter-game", label: "🚁 Helicopter Game", img: "/images/helicopter.png" },
  { path: "/games/laser-maze", label: "🪞 Laser Maze", img: "/images/laser-maze.png" },
];

export default function Games() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 text-white px-4 py-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-purple-400 drop-shadow mb-12">
          🎮 Mini Arcade – Choose Your Game
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <Link
              key={index}
              to={game.path}
              className="relative group rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-[0_0_20px_rgba(187,134,252,0.3)] hover:shadow-[0_0_30px_#bb86fc] hover:scale-[1.03] transition-all duration-300"
            >
              <img
                src={game.img}
                alt={game.label}
                className="w-full h-40 object-cover rounded-t-2xl border-b border-white/10"
              />
              <div className="p-4 text-center text-lg font-semibold text-white bg-black/20 backdrop-blur-sm">
                {game.label}
              </div>
              <div className="absolute inset-0 rounded-2xl border border-purple-500 opacity-10 group-hover:opacity-50 pointer-events-none transition-all duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
