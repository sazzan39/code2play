import React, { useState } from 'react';

export default function PuzzleGame({ agent, socket }) {
  const [grid, setGrid] = useState([1, 2, 3, 4, 5, 6, 7, 0, 8]); 
  const target = [1, 2, 3, 4, 5, 6, 7, 8, 0];

  const moveTile = (idx) => {
    const emptyIdx = grid.indexOf(0);
    const neighbors = [idx-1, idx+1, idx-3, idx+3];
    if (neighbors.includes(emptyIdx)) {
      const newGrid = [...grid];
      [newGrid[idx], newGrid[emptyIdx]] = [newGrid[emptyIdx], newGrid[idx]];
      setGrid(newGrid);
      if (newGrid.every((v, i) => v === target[i])) {
        socket.emit("treasureClaimed", { name: agent.name });
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-black mb-8 text-blue-500 italic uppercase">Vault Breaker</h2>
      <div className="grid grid-cols-3 gap-2 bg-white/5 p-4 rounded-xl border border-white/10">
        {grid.map((tile, i) => (
          <button
            key={i}
            onClick={() => moveTile(i)}
            className={`w-20 h-20 rounded-lg flex items-center justify-center text-2xl font-black ${
              tile === 0 ? 'bg-black/40' : 'bg-blue-600 text-white shadow-lg'
            }`}
          >
            {tile !== 0 ? tile : ''}
          </button>
        ))}
      </div>
      <p className="mt-8 text-zinc-500 font-mono text-[10px] animate-pulse">ARRANGE DATA BLOCKS TO UNLOCK VAULT</p>
    </div>
  );
}