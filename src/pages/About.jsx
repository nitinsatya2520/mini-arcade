import Navbar from "../components/Navbar";

export default function About() {
  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-purple-400 mb-8">🎮 About Mini Arcade</h1>

        <section className="mb-10 bg-white/5 p-6 rounded-xl shadow-lg border border-white/10">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            At <span className="text-purple-400 font-bold">Mini Arcade</span>, we bring timeless classics back to life with a modern twist.
            Our goal is to offer fun, fast, and nostalgic games that work seamlessly across desktop and mobile devices.
            Whether you’re dodging cars, breaking bricks, or solving puzzles, we aim to deliver excitement with every click.
          </p>
        </section>

        <section className="mb-10 bg-white/5 p-6 rounded-xl shadow-lg border border-white/10">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">Tech Stack</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li><span className="text-purple-400 font-semibold">React.js</span> – For fast and responsive UI</li>
            <li><span className="text-purple-400 font-semibold">Tailwind CSS</span> – Utility-first styling with dark mode aesthetics</li>
            <li><span className="text-purple-400 font-semibold">React Router</span> – Smooth page transitions</li>
            <li><span className="text-purple-400 font-semibold">Canvas / JavaScript</span> – Game logic and rendering</li>
          </ul>
        </section>

        <section className="mb-10 bg-white/5 p-6 rounded-xl shadow-lg border border-white/10">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">Game Library</h2>
          <p className="text-gray-300 mb-2">
            Our collection is growing! Currently, you can enjoy:
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-purple-300 font-medium">
            <li>🚗 Car Dodger</li>
            <li>🧱 Brick Breaker</li>
            <li>🐍 Snake Game</li>
            <li>🔫 Shooting Game</li>
            <li>🧠 Memory Flip</li>
            <li>🧮 2048</li>
            <li>🚁 Helicopter Game</li>
            <li>🧊 Pong</li>
            <li>🪞 Laser Mirror Maze</li>
          </ul>
        </section>

        <section className="bg-white/5 p-6 rounded-xl shadow-lg border border-white/10">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">Our Vision</h2>
          <p className="text-gray-300 leading-relaxed">
            We believe in the power of simple games to inspire joy. Built by a passionate indie developer, Mini Arcade is not just a platform—it's a tribute to the golden era of gaming, pixel by pixel.
            <br /><br />
            Stay tuned as we continue to add new games and features. Have feedback or game suggestions? We'd love to hear from you!
          </p>
        </section>
        <div className="text-center mt-8">
  <a href="mailto:techverrasolutions@gmail.com" className="text-purple-400 underline hover:text-purple-300">
    📩 Send Feedback or Suggestions
  </a>
</div>

      </div>
    </div></>
  );
}
