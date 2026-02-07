import React, { useState, useEffect } from 'react';
import { Trophy, Lock, MapPin } from 'lucide-react';

export default function WinnerView({ agent, winnerName, secretLocation }) {
  const [revealed, setRevealed] = useState(false);
  
  // Effect to simulate "decrypting" animation
  useEffect(() => {
    if (secretLocation) {
      setTimeout(() => setRevealed(true), 3000);
    }
  }, [secretLocation]);

  const isMe = agent?.name === winnerName;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-1000">
      
      {/* WINNER HEADER */}
      <div className="mb-12">
        <div className="inline-block p-6 rounded-full bg-yellow-500/10 border-2 border-yellow-500 mb-6 animate-bounce">
          <Trophy className="w-16 h-16 text-yellow-500" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 uppercase tracking-tighter mb-4">
          MISSION ACCOMPLISHED
        </h1>
        <p className="text-zinc-400 font-mono tracking-widest text-sm md:text-base">
          TOP AGENT: <span className="text-white font-bold text-xl">{winnerName}</span>
        </p>
      </div>

      {/* THE VAULT REVEAL */}
      <div className="w-full max-w-2xl bg-black border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
        
        {/* Background Grid Effect */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            {revealed ? <MapPin className="w-8 h-8 text-blue-500" /> : <Lock className="w-8 h-8 text-red-500 animate-pulse" />}
          </div>
          
          <h2 className="text-xs text-zinc-500 uppercase tracking-[0.5em] mb-8">
            {revealed ? "FINAL_COORDINATES_DECRYPTED" : "ENCRYPTED DATA STREAM"}
          </h2>

          <div className="font-black text-2xl md:text-4xl leading-tight uppercase font-mono text-white/90">
            {/* LOGIC: Only show secret if we have it (Winner) AND animation is done */}
            {secretLocation ? (
              revealed ? (
                <span className="animate-pulse text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  {secretLocation}
                </span>
              ) : (
                <span className="text-zinc-500 blur-[2px] animate-pulse">
                  DECRYPTING_SECURE_LOCATION...
                </span>
              )
            ) : (
              <span className="text-red-900/50 blur-[1px]">
                ACCESS DENIED // DATA LOCKED
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}