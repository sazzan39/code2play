import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Component Imports
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import AdminPortal from './components/AdminPortal';
import WinnerView from './components/WinnerView'; // ADD THIS LINE

const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:4001');

export default function App() {
  const [view, setView] = useState('login'); 
  const [agent, setAgent] = useState(null);
  const [task, setTask] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [winnerName, setWinnerName] = useState(null);

  useEffect(() => {
    socket.on("gameState", (gameState, currentTask) => {
      setAgent(gameState);
      setTask(currentTask);
      if (view !== 'winner') setView('play');
    });

    socket.on("leaderboardUpdate", (data) => {
      setLeaderboard(data);
    });

    socket.on("gameStarted", () => {
      if (view === 'waiting') setView('play');
    });

    socket.on("winner", (name) => {
      setWinnerName(name);
      setView('winner');
    });

    socket.on("forceReset", () => window.location.reload());

    return () => socket.off();
  }, [view]);

  const handleJoin = (name) => {
    if (!name) return alert("Enter an Agent ID");
    socket.emit("joinGame", name); 
    setView('waiting');
  };

  const handleAnswer = (isCorrect, type) => {
    socket.emit("submitAction", { isCorrect, type });
  };

  const handleAdminStart = () => {
    socket.emit("adminStart");
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-blue-500/30">
      
      {/* 🛡️ HIDDEN ADMIN TOGGLE */}
      <div 
        onClick={() => setIsAdmin(!isAdmin)}
        className="fixed top-2 right-2 z-50 w-6 h-6 opacity-0 hover:opacity-100 cursor-crosshair bg-white/10 rounded border border-white/20"
      />

      {isAdmin ? (
        <AdminPortal 
          players={leaderboard} 
          onStart={handleAdminStart} 
          socket={socket} 
        />
      ) : (
        <main className="container mx-auto px-4 py-8">
          
          {view === 'login' && <Login onJoin={handleJoin} />}

          {view === 'waiting' && (
            <div className="flex flex-col items-center justify-center h-[80vh]">
              <div className="text-4xl font-black italic mb-4 animate-pulse text-blue-500 uppercase">
                Linking_To_Vault...
              </div>
              <p className="text-zinc-500 text-sm tracking-[0.3em] uppercase">Awaiting Admin Authorization</p>
            </div>
          )}

          {view === 'play' && agent && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <Dashboard 
                  agent={agent} 
                  task={task} 
                  socket={socket} 
                  onAction={handleAnswer} 
                />
              </div>

              <aside className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
                <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                  Live_Infiltrators
                </h2>
                <div className="space-y-4">
                  {leaderboard.slice(0, 10).map((p, i) => (
                    <div key={i} className={`flex justify-between items-center ${p.id === socket.id ? 'text-blue-400 font-bold' : 'text-zinc-400'}`}>
                      <span className="text-xs truncate max-w-[100px]">{i + 1}. {p.name}</span>
                      <span className="text-[10px] font-mono opacity-60 uppercase">P{p.phase} // {p.score}</span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          )}

          {/* Corrected Winner View Logic */}
          {view === 'winner' && (
            <div className="space-y-8">
              <WinnerView 
                agent={agent} 
                treasureText="THE TREASURE IS ON THE EDGE OF THE CLASS!" 
              />
              <div className="text-center">
                <button 
                  onClick={() => socket.emit("forceReset")} 
                  className="text-zinc-500 hover:text-white underline uppercase text-[10px] tracking-widest"
                >
                  Initiate_System_Reset
                </button>
              </div>
            </div>
          )}

        </main>
      )}
    </div>
  );
}