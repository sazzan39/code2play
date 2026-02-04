import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import WinnerView from './components/WinnerView';


const socket = io('http://localhost:4001'); 

export default function App() {
  const [view, setView] = useState('login'); 
  const [agent, setAgent] = useState(null);
  const [question, setQuestion] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [treasure, setTreasure] = useState(null);

  useEffect(() => {
    socket.on("gameState", (gameState, currentQuestion) => {
      setAgent(gameState);
      setQuestion(currentQuestion);
      if (view !== 'winner') setView('play'); 
    });

    socket.on("waitingForAdmin", () => setView('waiting'));

    socket.on("revealTreasure", (text) => {
      setTreasure(text);
      setView('winner');
    });

    socket.on("forceReset", () => window.location.reload());

    return () => socket.off();
  }, [view]);

  const handleJoin = (formData) => {
    socket.emit("joinGame", { 
      playerName: formData.name.toUpperCase(), 
      roomCode: formData.code 
    });
  };

  const handleAnswer = (choice, correctAnswer) => {
    if (agent?.name) {
      socket.emit("submit", { 
        teamId: agent.name, 
        choice, 
        correctAnswer 
      });
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-blue-500/30">
      {/* hidden */}
      <button 
        onClick={() => setIsAdmin(!isAdmin)}
        className="fixed top-2 right-2 z-50 opacity-10 hover:opacity-100 text-[10px] bg-white/10 p-2 rounded"
      >
        {isAdmin ? "EXIT ADMIN" : "ADMIN"}
      </button>

      {isAdmin ? (
        <Leaderboard socket={socket} />
      ) : (
        <>
          {view === 'login' && <Login onJoin={handleJoin} />}
          
          {view === 'waiting' && (
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-6xl font-black italic animate-pulse">LINK ESTABLISHED</h1>
              <p className="text-blue-500 font-mono mt-4">Awaiting Admin Authorization...</p>
            </div>
          )}

          {view === 'play' && agent && (
            <Dashboard 
              agent={agent} 
              question={question} 
              onAnswer={handleAnswer} 
              socket={socket}
            />
          )}

          {view === 'winner' && (
            <WinnerView agent={agent} treasureText={treasure} />
          )}
        </>
      )}
    </div>
  );
}