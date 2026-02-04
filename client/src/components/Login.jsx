import React, { useState } from 'react';

export default function Login({ onJoin }) {
  //here tracking both the Room Code and the Player Name
  const [formData, setFormData] = useState({ name: "", code: "" });

  const handleJoin = () => {
    if (formData.name.trim() && formData.code.trim()) {
      onJoin(formData); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black w-full px-6">
      <div className="bg-[#1c1c1e] p-12 rounded-[3.5rem] shadow-2xl border border-white/5 text-center w-full max-w-sm">
        <h1 className="text-7xl font-bold text-white mb-2 italic tracking-tighter">Heist.</h1>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] mb-12 font-black italic">Establishing Secure Link</p>
        
        {/* Shared access*/}
        <input 
          className="w-full bg-black text-white p-5 rounded-2xl mb-4 text-center text-xl outline-none focus:border-blue-500 border-2 border-transparent transition-all uppercase font-mono"
          placeholder="ACCESS CODE"
          value={formData.code}
          onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
        />

        {/* Unique agent */}
        <input 
          className="w-full bg-black text-white p-5 rounded-2xl mb-8 text-center text-xl outline-none focus:border-blue-500 border-2 border-transparent transition-all uppercase font-mono"
          placeholder="AGENT NAME"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})}
        />
        
        <button 
          onClick={handleJoin}
          className="w-full bg-white text-black font-black py-6 rounded-3xl text-xl hover:bg-zinc-200 active:scale-95 transition-all shadow-xl"
        >
          INITIALIZE
        </button>
        
        <p className="mt-8 text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
          Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}