import React from 'react';

export default function WinnerView({ agent, treasureText }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 overflow-hidden">
      {/* CYBER AMBIANCE */}
      <div className="absolute inset-0 bg-blue-600/10 blur-[120px] animate-pulse"></div>

      <div className="relative z-10 text-center space-y-10">
        <div className="space-y-2">
          <h1 className="text-xl font-mono text-blue-500 tracking-[0.6em] uppercase">Infiltration Successful</h1>
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white">
            TREASURE_LOCATED
          </h2>
        </div>

        <div className="bg-white/5 border border-white/20 p-10 md:p-16 rounded-[3rem] backdrop-blur-2xl shadow-2xl relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest">
            DECRYPTED_LOCATION
          </div>
          
          <h3 className="text-3xl md:text-5xl font-black text-green-400 font-mono leading-tight">
            THE TREASURE IS ON THE EDGE OF THE CLASS!
          </h3>
          <p className="mt-6 text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Retrieve it before the system self-destructs.
          </p>
        </div>

        <div className="pt-6">
          <p className="text-zinc-600 font-mono text-[10px] uppercase">
            Master Agent: {agent?.name || "UNKNOWN"} // Session_ID: {Math.random().toString(16).slice(2, 8)}
          </p>
        </div>
      </div>
    </div>
  );
}