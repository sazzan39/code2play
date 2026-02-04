import React from 'react';
import SnakeGame from './SnakeGame';
import PuzzleGame from './PuzzleGame';

export default function Dashboard({ agent, question, onAnswer, socket }) {
  // PHASE 4: THE GRID PUZZLE
  if (agent.phase === 4) {
    return <PuzzleGame agent={agent} socket={socket} />;
  }

  // PHASE 3: THE SNAKE GAME
  if (agent.phase === 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black italic text-green-500">SYSTEM INFILTRATION</h2>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">Phase 03 // Collect Data Fragments</p>
        </div>
        <SnakeGame 
          onComplete={() => socket.emit("completePhase", { name: agent.name, phase: 3 })} 
        />
      </div>
    );
  }

  // DEFAULT: PHASE 1 and 2 (The Quiz)
  return (
    <div className="max-w-2xl mx-auto p-8 bg-zinc-900/50 border border-white/10 rounded-3xl">
      <div className="flex justify-between items-center mb-8">
        <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest">
          PHASE 0{agent.phase}
        </span>
        <span className="text-zinc-500 font-mono text-xs uppercase">Score: {agent.score}</span>
      </div>
      
      <h3 className="text-3xl font-bold mb-8 leading-tight">{question?.text}</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {question?.options.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => onAnswer(i, question.correct)}
            className="group flex items-center p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-blue-600 hover:border-blue-400 transition-all text-left"
          >
            <span className="text-zinc-600 group-hover:text-white/50 font-mono mr-4">0{i+1}</span>
            <span className="font-medium">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}