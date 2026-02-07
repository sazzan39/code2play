import React from 'react';

export default function Quiz({ task, onAction }) {
 
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/50 rounded-[2rem] border border-white/5">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Fetching Encrypted Data...</p>
      </div>
    );
  }

  const handleAnswer = (index) => {
    
    const isCorrect = index === task.c;
    onAction(isCorrect, 'quiz');
  };

  return (
    <div className="p-8 md:p-12 bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
      {/* Header Info */}
      <div className="mb-10 text-center">
        <h2 className="text-blue-500 font-black tracking-[0.5em] uppercase text-[10px] mb-2">Phase 01 // Social_Engineering</h2>
        <div className="h-[1px] w-20 bg-blue-500/30 mx-auto"></div>
      </div>

      {/* Question Text */}
      <h3 className="text-xl md:text-3xl font-bold text-center mb-12 leading-tight tracking-tight">
        {task.q}
      </h3>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {task.a.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className="group relative p-6 bg-black/40 border border-white/5 rounded-2xl text-left transition-all duration-200 hover:bg-blue-600 hover:border-blue-400 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-zinc-500 group-hover:text-white/70 uppercase">Option_0{i + 1}</span>
              <span className="text-sm md:text-base font-medium group-hover:text-white">{option}</span>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-12 text-center text-zinc-600 font-mono text-[9px] uppercase tracking-widest italic">
        Caution: Incorrect entries will result in score degradation.
      </p>
    </div>
  );
}