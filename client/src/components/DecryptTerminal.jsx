import React, { useState, useEffect } from 'react';

export default function DecryptTerminal({ target, socket, name, onAction }) {
  const [grid, setGrid] = useState([]); // Fixed: naming consistency

  useEffect(() => {
    // Generate a field of 48 hex codes
    const items = Array.from({ length: 48 }, () => 
      "0x" + Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0')
    );
    // Inject the actual target into a random position
    const randomIndex = Math.floor(Math.random() * 48);
    items[randomIndex] = target;
    setGrid(items); // Fixed: calling the correct setter
  }, [target]);

  const handleHexClick = (code) => {
    // Report success or failure to the main handler
    onAction(code === target, 'decryption');
  };

  return (
    <div className="p-8 bg-zinc-900 border border-green-500/20 rounded-3xl font-mono shadow-[0_0_50px_rgba(34,197,94,0.1)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-green-500 font-black tracking-widest animate-pulse uppercase text-xs">Phase 02 // Brute_Force</h2>
          <p className="text-[8px] text-zinc-600 uppercase mt-1">Locate target hash in memory stream</p>
        </div>
        <div className="bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/30 text-green-500 text-[10px] font-bold">
          TARGET: {target}
        </div>
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {grid.map((code, i) => (
          <button
            key={i}
            onClick={() => handleHexClick(code)}
            className="py-3 bg-black border border-white/5 rounded-lg text-[10px] text-zinc-400 hover:bg-green-600 hover:text-black hover:border-green-600 transition-all duration-150 active:scale-90"
          >
            {code}
          </button>
        ))}
      </div>
    </div>
  );
}