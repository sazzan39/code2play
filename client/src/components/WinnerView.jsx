import React from 'react';

export default function WinnerView({ agent, treasureText }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 overflow-hidden">
      {/* GLOWING AMBIANCE */}
      <div className="absolute inset-0 bg-blue-600/10 blur-[150px] animate-pulse"></div>

      <div className="relative z-10 text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-mono text-blue-500 tracking-[0.5em] uppercase">Security Breached</h1>
          <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter">VAULT OPEN</h2>
        </div>

        <div className="bg-white/5 border border-white/20 p-12 rounded-[40px] backdrop-blur-xl shadow-2xl">
          <p className="text-zinc-500 font-mono text-xs mb-4 tracking-widest uppercase">The Secret Treasure:</p>
          <h3 className="text-4xl md:text-6xl font-black text-green-400 font-mono break-all">
            {treasureText || "MISSION_COMPLETE"}
          </h3>
        </div>

        <div className="pt-8">
          <p className="text-zinc-600 font-mono text-xs uppercase italic">
            Agent: {agent.name} // Authority: Master Infiltrator
          </p>
        </div>
      </div>
    </div>
  );
}