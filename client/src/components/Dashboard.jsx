import React, { useEffect } from 'react';
import Quiz from './Quiz';
import DecryptTerminal from './DecryptTerminal';
import SnakeGame from './PacketSnake'; 
import LogicPuzzle from './LogicPuzzle';

export default function Dashboard({ agent, task, socket, onAction }) {
  
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && agent.phase > 0) {
        // Automatically deduct points for tab switching
        onAction(false, 'cheat');
        alert("⚠️ SECURITY BREACH: TAB SWITCHING DETECTED. POINTS DEDUCTED.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [agent.phase, onAction]);


  switch (agent.phase) {
    case 1:
      return <Quiz task={task} socket={socket} name={agent.name} onAction={onAction} />;
    case 2:
      return <DecryptTerminal target={task?.target} socket={socket} name={agent.name} onAction={onAction} />;
    case 3:
      return <SnakeGame socket={socket} name={agent.name} onAction={onAction} />;
    case 4:
      return <LogicPuzzle socket={socket} name={agent.name} onAction={onAction} />;
    default:
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-blue-500 animate-pulse font-mono tracking-widest">
            ESTABLISHING SECURE TUNNEL....
          </div>
        </div>
      );
  }
}