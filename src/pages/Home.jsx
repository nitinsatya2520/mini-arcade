import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { FaGamepad, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { ReactTyped } from "react-typed";
import ParticlesBackground from "../components/ParticlesBackground";
import MusicVisualizer from "../components/MusicVisualizer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Home() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    const handlePlay = () => {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };

    document.addEventListener("click", handlePlay, { once: true });

    return () => {
      document.removeEventListener("click", handlePlay);
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  return (
    <>
      <Navbar />
      <ParticlesBackground />
      <audio ref={audioRef} src="/arcade-theme.mp3" loop preload="auto" />
      <MusicVisualizer audioRef={audioRef} />

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="text-5xl sm:text-6xl mb-4 text-purple-400 drop-shadow-lg">
          <FaGamepad />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2">Mini Arcade</h1>

        <ReactTyped
          strings={["Fast. Fun. Addictive."]}
          typeSpeed={60}
          backSpeed={40}
          loop
          className="text-xl sm:text-2xl text-purple-300 mb-6"
        />

        <p className="text-lg sm:text-xl text-gray-400 max-w-xl mb-8">
          Play classic and modern games built with React — fast, smooth, and fun.
        </p>

        <Link
          to="/games"
          className="relative px-8 py-3 text-lg font-semibold text-white rounded-xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition duration-300 hover:shadow-[0_0_15px_#bb86fc]"
        >
          🎲 Start Playing
        </Link>

        {/* Equalizer bars */}
        <div className="flex gap-1 h-8 mt-8 bg-white/5 px-2 py-1 rounded-md backdrop-blur-sm shadow-inner shadow-purple-800/20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-sm ${
                playing ? "animate-eq-bar" : "opacity-30"
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Audio toggle button */}
        <button
          onClick={toggleAudio}
          className="mt-6 text-purple-400 hover:text-purple-200 transition text-xl"
          title={playing ? "Mute Music" : "Play Music"}
        >
          {playing ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>
        <div className="mt-16 w-full max-w-4xl bg-white/5 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md border border-white/10 hover:shadow-[0_0_30px_#bb86fc] transition duration-300">
  <div className="flex flex-col sm:flex-row">
    
    {/* Game Thumbnail */}
    <div className="sm:w-1/2 h-64 sm:h-auto">
      <img
        src="/images/snake.png"
        alt="Snake Game"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Game Info */}
    <div className="sm:w-1/2 p-6 flex flex-col justify-between text-left">
      <div>
        <h2 className="text-2xl font-bold text-purple-300 mb-2">🐍 Snake Game</h2>
        <p className="text-gray-300 text-sm sm:text-base">
          Relive the retro days! Guide your snake, eat the dots, and grow without hitting the wall.
          Optimized for desktop and mobile.
        </p>
      </div>

      <Link
        to="/games/snake"
        className="mt-4 inline-block w-fit px-5 py-2 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition"
      >
        ▶️ Play Now
      </Link>
    </div>
  </div>
</div>
<div className="mt-20 w-full px-6 max-w-6xl mx-auto">
  <h2 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-6 text-center">
    🌟 Featured Games
  </h2>

  <Swiper
    modules={[Autoplay, Pagination]}
    spaceBetween={20}
    slidesPerView={1}
    loop={true}
    autoplay={{
      delay: 3000,
      disableOnInteraction: false,
    }}
    pagination={{ clickable: true }}
    breakpoints={{
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }}
    className="pb-10"
  >
    {[
      {
        title: "Car Dodger",
        image: "/images/car-dodger.png",
        path: "/games/car-dodger",
      },
      {
        title: "Brick Breaker",
        image: "/images/brick-breaker.png",
        path: "/games/brick-breaker",
      },
      {
        title: "Snake Game",
        image: "/images/snake.png",
        path: "/games/snake",
      },
      {
        title: "Shooting Game",
        image: "/images/shooting.png",
        path: "/games/shooting",
      },
      {
        title: "2048 Game",
        image: "/images/2048.png",
        path: "/games/2048",
      },
      {
        title: "Memory Game",
        image: "/images/memory.png",
        path: "/games/memory-game",
      },
      {
        title: "Pong Game",
        image: "/images/pong.png",
        path: "/games/pong",
      },
      {
        title: "Helicopter Game",
        image: "/images/helicopter.png",
        path: "/games/helicopter",
      },
      {
        title: "Rock Paper Scissors",
        image: "/images/rps.png",
        path: "/games/rock-paper-scissors",
      },
      {
        title: "Space Invaders",
        image: "/images/space-invaders.png",
        path: "/games/space-invaders",
      },
      {
        title: "Laser Mirror Maze",
        image: "/images/laser-maze.png",
        path: "/games/laser-mirror-maze",
      },
    ].map((game, idx) => (
      <SwiperSlide key={idx}>
        <Link
          to={game.path}
          title={`Play ${game.title}`}
          aria-label={`Play ${game.title}`}
          className="relative group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-md hover:shadow-[0_0_20px_#bb86fc] hover:scale-105 transition-transform duration-300 block"
        >
          <img
            src={game.image}
            alt={game.title}
            loading="lazy"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-4 text-center relative z-10">
            <h3 className="text-lg font-semibold text-purple-300">
              {game.title}
            </h3>
          </div>
        </Link>
      </SwiperSlide>
    ))}
  </Swiper>
</div>


<div className="mt-20 max-w-6xl w-full px-6">
  <h2 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-6 text-center">
    🧩 Explore Game Categories
  </h2>

  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
    {[
      { name: "🎯 Arcade", route: "/games" },
      { name: "🚀 Action", route: "/games" },
      { name: "🧠 Puzzle", route: "/games" },
      { name: "🎮 Classic", route: "/games" },
      { name: "🕹️ Skill", route: "/games" },
      { name: "🧱 Brick", route: "/games/brick-breaker" },
      { name: "🐍 Snake", route: "/games/snake" },
      { name: "🚗 Dodger", route: "/games/car-dodger" },
    ].map((category, idx) => (
      <Link
        key={idx}
        to={category.route}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center text-white font-semibold text-sm sm:text-base shadow-md transition transform hover:scale-105 hover:shadow-[0_0_25px_#bb86fc]"
      >
        {category.name}
      </Link>
    ))}
  </div>
</div>


      </div>
    </>
  );
}
