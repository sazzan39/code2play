import React, { useState, useEffect } from 'react';

export default function Leaderboard({ socket }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // 1. Listen for the leaderboard update from the server
    socket.on("leaderboardUpdate", (playerList) => {
      console.log("Leaderboard updated:", playerList);
      setPlayers(playerList);
    });

    // 2. Cleanup listener on unmount
    return () => socket.off("leaderboardUpdate");
  }, [socket]);

  // 3. This function sends the specific signal your server is waiting for
  const handleReleaseBreach = () => {
    console.log("Emitting adminStartGame...");
    socket.emit("adminStartGame"); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 font-sans">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase leading-none">
          Rankings
        </h1>
        <p className="text-blue-500 font-mono tracking-[0.5em] text-sm mt-2 uppercase">
          Live Mission Intelligence
        </p>
      </div>

      {/* Agents List */}
      <div className="w-full max-w-2xl bg-zinc-900/30 border border-white/5 rounded-2xl p-6 mb-10">
        <div className="flex justify-between text-zinc-500 text-[10px] uppercase tracking-widest border-b border-white/10 pb-2 mb-4">
          <span>Agent Name</span>
          <span>Status / Score</span>
        </div>

        <div className="space-y-3">
          {players.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-zinc-600 font-mono animate-pulse uppercase text-xs">
                Waiting for agents to establish link...
              </p>
            </div>
          ) : (
            players.map((player, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center py-3 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <span className="text-blue-500 font-mono text-xs">0{index + 1}</span>
                  <span className="font-bold tracking-tight text-xl">{player.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-zinc-500 font-mono text-sm">{player.score} PTS</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Authorization Button */}
      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={handleReleaseBreach}
          className="bg-white text-black px-16 py-5 rounded-full font-black text-xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 uppercase tracking-widest shadow-[0_0_30px_rgba(59,130,246,0.2)]"
        >
          Release the Breach
        </button>
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-mono">
          Authorization Required to Initiate Phase 01
        </p>
      </div>
    </div>
  );
}