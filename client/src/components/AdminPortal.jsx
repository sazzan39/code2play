import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Users, Play, RotateCcw } from 'lucide-react';

export default function AdminPortal({ players, onStart, socket }) {
  const [status, setStatus] = useState("OFFLINE");

  useEffect(() => {
    if (socket && socket.connected) {
      setStatus("CONNECTED");
    }
  }, [socket]);

  // Emergency Reset Handler
  const handleReset = () => {
    if (confirm("WARNING: This will kick all players and reset scores. Proceed?")) {
      socket.emit("forceReset");
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-green-500/30 pb-6 mb-8">
        <h1 className="text-4xl font-black tracking-[0.2em] flex items-center gap-4">
          <Shield className="w-10 h-10" />
          WAR MAP LIVE
        </h1>
        <div className="flex items-center gap-4">
          <span className={`w-3 h-3 rounded-full ${status === "CONNECTED" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
          <span className="text-xs uppercase tracking-widest opacity-70">SYSTEM: {status}</span>
        </div>
      </div>

      {/* CONTROL DECK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* BIG RED BUTTON (Green in this case) */}
        <button 
          onClick={onStart}
          className="group relative h-40 flex flex-col items-center justify-center bg-green-500/10 border-2 border-green-500 rounded-3xl hover:bg-green-500 hover:text-black transition-all duration-300"
        >
          <Play className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-black uppercase tracking-[0.2em]">RELEASE THE BREACH</span>
          <span className="text-[10px] mt-2 opacity-60 uppercase">Initiates Phase 1 for all agents</span>
        </button>

        {/* EMERGENCY RESET */}
        <button 
          onClick={handleReset}
          className="h-40 flex flex-col items-center justify-center bg-red-900/10 border border-red-900/50 rounded-3xl text-red-500 hover:bg-red-900/30 transition-all"
        >
          <RotateCcw className="w-12 h-12 mb-4" />
          <span className="text-xl font-bold uppercase tracking-widest">EMERGENCY RESET</span>
        </button>
      </div>

      {/* LIVE PLAYER LIST */}
      <div className="border border-green-500/20 rounded-2xl p-8 bg-zinc-900/50">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Users className="w-6 h-6" />
          AGENTS_ONLINE ({players.length})
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {players.map((p, i) => (
            <div key={i} className="p-4 bg-black border border-green-500/30 rounded-lg">
              <div className="text-xs opacity-50 mb-1">ID_0{i+1}</div>
              <div className="font-bold text-white truncate">{p.name}</div>
              <div className="text-[10px] mt-2 flex justify-between text-green-400">
                <span>PHASE {p.phase}</span>
                <span>{p.score} PTS</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-1 bg-green-900/30 mt-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500" 
                  style={{ width: `${(p.score / 1000) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}