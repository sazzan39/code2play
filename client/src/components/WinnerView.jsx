import React, { useState, useEffect } from 'react';
import { Trophy, Lock, MapPin } from 'lucide-react';

export default function WinnerView({ agent, winnerName }) {
  const [revealed, setRevealed] = useState(false);
  
  // The secret message for the physical treasure hunt
  const SECRET_LOCATION = "THE TREASURE IS ON THE EDGE OF THE DOOR!";

  useEffect(() => {
    // Fake "Decryption" delay
    setTimeout(() => setRevealed(true), 3000);
  }, []);

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

      {/* THE VAULT REVEAL (Only show this part) */}
      <div className="w-full max-w-2xl bg-black border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
        
        {/* Background Grid Effect */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            {revealed ? <MapPin className="w-8 h-8 text-blue-500" /> : <Lock className="w-8 h-8 text-red-500 animate-pulse" />}
          </div>
          
          <h2 className="text-xs text-zinc-500 uppercase tracking-[0.5em] mb-8">
            {revealed ? "FINAL_COORDINATES_DECRYPTED" : "DECRYPTING_SECURE_LOCATION..."}
          </h2>

          <div className="font-black text-2xl md:text-4xl leading-tight uppercase font-mono text-white/90">
            {revealed ? (
              <span className="animate-pulse text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                {SECRET_LOCATION}
              </span>
            ) : (
              <span className="text-zinc-700 blur-[2px]">
                0x4F 0x9A 0x12 LOADING... ENCRYPTED DATA
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}