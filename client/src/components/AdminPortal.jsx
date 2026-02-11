import React, { useState, useEffect } from 'react';
import { Shield, Users, Play, RotateCcw, Lock, AlertTriangle } from 'lucide-react';

export default function AdminPortal({ players, onStart, socket }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState("OFFLINE");

  useEffect(() => {
    // Check connection immediately and listen for changes
    if (socket && socket.connected) setStatus("CONNECTED");
    
    socket.on("connect", () => setStatus("CONNECTED"));
    socket.on("disconnect", () => setStatus("OFFLINE"));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleLoginSuccess = () => {
      setIsAuthenticated(true);
      setErrorMessage("");
    };

    const handleLoginFail = () => {
      setErrorMessage("ACCESS DENIED");
      setPassword("");
    };

    socket.on("adminLoginSuccess", handleLoginSuccess);
    socket.on("adminLoginFail", handleLoginFail);

    return () => {
      socket.off("adminLoginSuccess", handleLoginSuccess);
      socket.off("adminLoginFail", handleLoginFail);
    };
  }, [socket]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (status !== "CONNECTED") {
      setErrorMessage("SYSTEM OFFLINE");
      return;
    }
    setErrorMessage("");
    socket.emit("adminLogin", password);
  };

  const handleStartGame = () => {
    if (status !== "CONNECTED") {
      alert("⚠️ SYSTEM OFFLINE: Refresh the page to reconnect to the server.");
      return;
    }
    onStart();
  };

  const handleReset = () => {
    if (confirm("⚠️ WARNING: This will kick all players and reset scores. Are you sure?")) {
      socket.emit("forceReset");
    }
  };

  // 🔒 LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-zinc-900 border border-red-900/50 p-8 rounded-2xl shadow-2xl">
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16 text-red-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-red-500 text-center mb-2 tracking-[0.2em]">CLASSIFIED ACCESS</h2>
          <p className="text-zinc-500 text-xs text-center mb-8 uppercase">Security Clearance Required</p>
          
          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER PASSWORD"
                className="w-full bg-black border border-zinc-700 text-white p-3 pl-10 rounded-lg focus:border-red-500 focus:outline-none"
                autoFocus
              />
            </div>
            {errorMessage && <div className="text-red-500 text-xs font-bold text-center">{errorMessage}</div>}
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-black font-bold py-3 rounded-lg uppercase">
              Authenticate
            </button>
          </div>
        </form>
      </div>
    );
  }

  //  DASHBOARD
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8">
      <div className="flex justify-between items-center border-b border-green-500/30 pb-6 mb-8">
        <h1 className="text-2xl md:text-4xl font-black tracking-[0.2em] flex items-center gap-4">
          <Shield className="w-8 h-8 md:w-10 md:h-10" /> WAR MAP LIVE
        </h1>
        <div className="flex items-center gap-4">
          <span className={`w-3 h-3 rounded-full ${status === "CONNECTED" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
          <span className="text-xs uppercase tracking-widest opacity-70">SYSTEM: {status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <button 
          onClick={handleStartGame}
          className={`group h-40 flex flex-col items-center justify-center border-2 rounded-3xl transition-all ${status === "CONNECTED" ? "bg-green-500/10 border-green-500 hover:bg-green-500 hover:text-black" : "border-zinc-800 opacity-50 cursor-not-allowed"}`}
        >
          <Play className="w-16 h-16 mb-4 group-hover:scale-110" />
          <span className="text-2xl font-black uppercase tracking-[0.2em]">RELEASE THE BREACH</span>
        </button>

        <button onClick={handleReset} className="h-40 flex flex-col items-center justify-center bg-red-900/10 border border-red-900/50 rounded-3xl text-red-500 hover:bg-red-900/30">
          <RotateCcw className="w-12 h-12 mb-4" />
          <span className="text-xl font-bold uppercase tracking-widest">EMERGENCY RESET</span>
        </button>
      </div>

      <div className="border border-green-500/20 rounded-2xl p-8 bg-zinc-900/50">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><Users className="w-6 h-6" /> AGENTS_ONLINE ({players.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {players.map((p, i) => (
            <div key={i} className="p-4 bg-black border border-green-500/30 rounded-lg">
              <div className="font-bold text-white truncate">{p.name}</div>
              <div className="text-[10px] text-green-400">P{p.phase} // {p.score} PTS</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}