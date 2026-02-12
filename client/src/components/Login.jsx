import React, { useState } from 'react';
import Button from './Button'; //

export default function Login({ onJoin }) {
  const [agentName, setAgentName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agentName.trim()) {
      onJoin(agentName.trim()); //
    }
  };

  return (
    <div className="h-[80vh] flex flex-col items-center justify-center">
      <div className="mb-12 text-center">
        <h1 className="text-6xl font-black italic tracking-tighter text-white mb-2 uppercase">The Heist</h1>
        <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)]" />
        <p className="mt-4 text-[10px] text-zinc-500 font-mono tracking-[0.4em] uppercase">Unauthorized Access Prohibited</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-6">
        <div className="relative group">
          <input 
            autoFocus
            type="text"
            placeholder="AGENT_IDENTIFIER" 
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/10 p-5 rounded-2xl text-center font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-700"
          />
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100">
            <span className="text-blue-500 text-xs font-mono">{'>'}</span>
          </div>
        </div>

        <Button 
          type="submit"
          className="w-full"
          variant="primary"
        >
          Infiltrate System39
        </Button>
      </form>

      <div className="mt-12 flex gap-8 opacity-20">
        <div className="text-[8px] font-mono">ENCRYPTION: SZN-39</div>
        <div className="text-[8px] font-mono">CONNECTION: SECURE</div>
        <div className="text-[8px] font-mono">TRACE: DISABLED</div>
      </div>
    </div>
  );
}