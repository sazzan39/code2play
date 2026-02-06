import React, { useState } from 'react';
import Button from './Button'; //

export default function AdminPortal({ players, onStart, socket }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [creds, setCreds] = useState({ email: '', pass: '' });
  const [error, setError] = useState('');

  // Use your established credentials
  const ADMIN_EMAIL = "admin@heist.com";
  const ADMIN_PASS = "Vault2026!";

  const handleLogin = (e) => {
    e.preventDefault();
    if (creds.email === ADMIN_EMAIL && creds.pass === ADMIN_PASS) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('ACCESS_DENIED: AUTHENTICATION_FAILURE');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black px-4">
        <form onSubmit={handleLogin} className="p-8 md:p-12 bg-zinc-900/40 border border-blue-900/30 rounded-[2.5rem] backdrop-blur-2xl w-full max-w-md shadow-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-black italic text-blue-500 tracking-tighter uppercase">Admin Command</h2>
            <p className="text-zinc-500 text-[10px] font-mono mt-1">SECURE CREDENTIALS REQUIRED</p>
          </div>
          
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="ADMIN EMAIL" 
              className="w-full bg-black/50 border border-zinc-800 p-4 rounded-xl text-sm font-mono focus:border-blue-500 outline-none"
              onChange={(e) => setCreds({ ...creds, email: e.target.value })}
            />
            <input 
              type="password" 
              placeholder="ENCRYPTION PASS" 
              className="w-full bg-black/50 border border-zinc-800 p-4 rounded-xl text-sm font-mono focus:border-blue-500 outline-none"
              onChange={(e) => setCreds({ ...creds, pass: e.target.value })}
            />
          </div>
          
          {error && <p className="text-red-500 text-[10px] mt-4 font-mono animate-pulse">{error}</p>}
          
          <Button type="submit" className="w-full mt-8" variant="primary">
            Unlock War Map
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen font-mono">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8 bg-zinc-900/20 p-8 rounded-3xl border border-white/5">
        <div>
          <h1 className="text-4xl font-black italic text-white tracking-tighter">WAR MAP LIVE</h1>
          <div className="flex gap-4 mt-2">
            <span className="text-zinc-500 text-[10px] uppercase">Agents_Online: {players.length}</span>
            <span className="text-blue-500 text-[10px] uppercase">System: Operational</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <Button onClick={onStart} variant="success" className="flex-1 lg:flex-none">
            Release The Breach
          </Button>
          <Button onClick={() => socket.emit("forceReset")} variant="danger" className="flex-1 lg:flex-none">
            Emergency Reset
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {players.map((p, i) => (
          <div key={i} className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl group hover:border-blue-500/50 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="max-w-[70%]">
                <span className="text-[8px] text-zinc-600 block uppercase tracking-widest">Agent Identifier</span>
                <span className={`text-lg font-bold truncate block ${p.phase === 4 ? 'text-yellow-400' : 'text-white'}`}>{p.name}</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] text-zinc-600 block uppercase tracking-widest">Breach Phase</span>
                <span className="text-xl font-black text-blue-500">0{p.phase}</span>
              </div>
            </div>

            {/* LIVE PROGRESS BAR */}
            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden mb-3 border border-white/5">
              <div 
                className={`h-full transition-all duration-1000 ${p.phase === 4 ? 'bg-yellow-400' : 'bg-blue-600'}`}
                style={{ width: `${Math.min((p.score / 750) * 100, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase">
              <span>Intel_Score: {p.score}</span>
              <span>{Math.floor((p.score / 750) * 100)}% Comp</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}