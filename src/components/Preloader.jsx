import React from "react";

export default function Preloader() {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center text-purple-400 text-xl font-bold font-arcade gap-4">
      <img
        src="/logo192.png"
        alt="Mini Arcade Logo"
        className="w-28 h-28 animate-bounce"
      />

      <p className="text-3xl tracking-widest text-purple-300 animate-pulse">
        MINI ARCADE
      </p>

      {/* Retro Loading Bar */}
      <div className="w-60 h-4 border-2 border-purple-500 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1/3 bg-purple-400 animate-loader-move"></div>
      </div>

      <p className="text-sm tracking-wide text-purple-200">Loading… Please wait</p>
    </div>
  );
}
