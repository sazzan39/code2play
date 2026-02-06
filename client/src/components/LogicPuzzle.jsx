import React, { useState, useEffect } from 'react';

export default function LogicPuzzle({ socket, name, onAction }) {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [isDisplaying, setIsDisplaying] = useState(false);

  // Start the first round
  useEffect(() => {
    addNewStep();
  }, []);

  const addNewStep = () => {
    const newNode = Math.floor(Math.random() * 9);
    setSequence(prev => [...prev, newNode]);
    playSequence([...sequence, newNode]);
  };

  const playSequence = async (seq) => {
    setIsDisplaying(true);
    for (let node of seq) {
      setActiveNode(node);
      await new Promise(r => setTimeout(r, 600));
      setActiveNode(null);
      await new Promise(r => setTimeout(r, 200));
    }
    setIsDisplaying(false);
  };

  const handleNodeClick = (index) => {
    if (isDisplaying) return;

    const newUserSeq = [...userSequence, index];
    setUserSequence(newUserSeq);

    // Visual feedback for the click
    setActiveNode(index);
    setTimeout(() => setActiveNode(null), 200);

    // Check if the move is correct
    if (index !== sequence[userSequence.length]) {
      onAction(false, 'logic_puzzle'); // Penalty for wrong sequence
      setUserSequence([]);
      playSequence(sequence); // Replay the current sequence for them
      return;
    }

    // Check if sequence is complete
    if (newUserSeq.length === sequence.length) {
      onAction(true, 'logic_puzzle'); // Reward for completing a round
      setUserSequence([]);
      setTimeout(addNewStep, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center bg-zinc-900/40 p-10 rounded-[2.5rem] border border-blue-500/10 backdrop-blur-xl">
      <div className="text-center mb-8">
        <h2 className="text-blue-500 font-black tracking-[0.4em] uppercase text-xs">Phase 04 // Neural Sync</h2>
        <p className="text-zinc-500 text-[10px] mt-2 font-mono">MATCH THE ENCRYPTION PATTERN TO BREACH THE FINAL VAULT</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <button
            key={i}
            onClick={() => handleNodeClick(i)}
            disabled={isDisplaying}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl border transition-all duration-300 ${
              activeNode === i 
                ? 'bg-blue-500 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.6)] scale-95' 
                : 'bg-black/50 border-white/5 hover:border-blue-500/30'
            }`}
          />
        ))}
      </div>

      <div className="mt-10 flex gap-2">
        {sequence.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 w-6 rounded-full ${i < userSequence.length ? 'bg-blue-500' : 'bg-zinc-800'}`} 
          />
        ))}
      </div>
    </div>
  );
}