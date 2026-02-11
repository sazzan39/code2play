import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Component Imports
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import AdminPortal from './components/AdminPortal';
import WinnerView from './components/WinnerView';

const SERVER_URL = window.location.hostname.includes("localhost")

  ? "http://localhost:10000" 
  : "https://distant-orelle-sazzan-507606d3.koyeb.app";


const socket = io(SERVER_URL, {
  transports: ["websocket", "polling"]
});

export default function App() {
  const [view, setView] = useState('login'); 
  const [agent, setAgent] = useState(null);
  const [task, setTask] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  
  
  const [winnerName, setWinnerName] = useState(null);
  const [secretLocation, setSecretLocation] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);


  //sound
  const clickSoundRef = useRef(new Audio('/Users/sajandhakal/Desktop/Coding/Projects/code2play/client/public/Audio/click.mp3')); 

  useEffect(() => {
  
    clickSoundRef.current.volume = 0.5;
    clickSoundRef.current.load();

    const playGlobalClick = () => {
      const audio = clickSoundRef.current;
      
    
      if (!audio.paused) {
        audio.currentTime = 0;
      }
      
      audio.play().catch((err) => {
      
      });
    };

    window.addEventListener('click', playGlobalClick);
    return () => window.removeEventListener('click', playGlobalClick);
  }, []);

 
  useEffect(() => {
    socket.on("gameState", (playerState, currentTask) => {
      setAgent(playerState);
      setTask(currentTask);
      if (view !== 'winner' && !isAdminMode) setView('play');
    });

    socket.on("leaderboardUpdate", (data) => setLeaderboard(data));
    
    socket.on("gameStarted", () => {
      if (view === 'waiting') setView('play');
    });

    socket.on("winner", (name) => {
      setWinnerName(name);
      setView('winner');
    });

    socket.on("secretReveal", ({ location }) => {
      setSecretLocation(location);
    });

    socket.on("forceReset", () => window.location.reload());

    return () => {
      socket.off("gameState");
      socket.off("leaderboardUpdate");
      socket.off("gameStarted");
      socket.off("winner");
      socket.off("secretReveal");
      socket.off("forceReset");
    };
  }, [view, isAdminMode]);

  // 3. HANDLERS
  const handleJoin = (name) => {
    if (!name) return alert("Enter an Agent ID");
    socket.emit("joinGame", name); 
    setView('waiting');
  };

  const handleAnswer = (isCorrect, type) => {
    if (agent) socket.emit("submitAction", { isCorrect, type });
  };

  const handleAdminStart = () => {
    socket.emit("adminStart");
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 🛡️ HIDDEN ADMIN TOGGLE */}
      <div 
        onClick={() => setIsAdminMode(!isAdminMode)}
        className="fixed top-0 right-0 z-[9999] w-8 h-8 cursor-crosshair hover:bg-red-500/20"
      />

      {isAdminMode ? (
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
              <div className="text-2xl md:text-4xl font-black italic mb-4 animate-pulse text-blue-500 uppercase tracking-widest text-center">
                Linking_To_Vault...
              </div>
              <p className="text-zinc-600 text-[10px] md:text-xs tracking-[0.5em] uppercase">
                Awaiting Admin Authorization
              </p>
            </div>
          )}

          {view === 'play' && agent && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <Dashboard agent={agent} task={task} onAction={handleAnswer} />
              </div>
              <aside className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md h-fit">
                <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                  Live_Infiltrators
                </h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {leaderboard.map((p, i) => (
                    <div key={i} className={`flex justify-between items-center ${p.id === socket.id ? 'text-blue-400 font-bold' : 'text-zinc-500'}`}>
                      <span className="text-xs truncate max-w-[120px]">{i + 1}. {p.name}</span>
                      <span className="text-[10px] font-mono opacity-60 uppercase">P{p.phase} // {p.score}</span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          )}

          {view === 'winner' && (
            <WinnerView 
              winnerName={winnerName} 
              agent={agent}
              secretLocation={secretLocation} 
            />
          )}

        </main>
      )}
    </div>
  );
}