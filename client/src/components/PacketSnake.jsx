import React, { useState, useEffect, useRef } from 'react';

export default function PacketSnake({ socket, name, onAction }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const GRID_SIZE = 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
      if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
      if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
      if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
    };

    window.addEventListener('keydown', handleKeyDown);

    const gameLoop = setInterval(() => {
      // Move Snake
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };
      snake.unshift(head);

      // Check if ate food
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 1);
        onAction(true, 'packet_sniffed'); // Send points to server
        food = { 
          x: Math.floor(Math.random() * (canvas.width / GRID_SIZE)), 
          y: Math.floor(Math.random() * (canvas.height / GRID_SIZE)) 
        };
      } else {
        if (dx !== 0 || dy !== 0) snake.pop();
      }

      // Wall/Self Collision
      if (head.x < 0 || head.x >= canvas.width / GRID_SIZE || head.y < 0 || head.y >= canvas.height / GRID_SIZE) {
        onAction(false, 'snake'); // Trigger server-side penalty
        snake = [{ x: 10, y: 10 }];
        dx = 0; dy = 0;
      }

      // Draw everything
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#2563eb'; // Blue Snake
      snake.forEach(p => ctx.fillRect(p.x * GRID_SIZE, p.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2));

      ctx.fillStyle = '#22c55e'; // Green Food
      ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    }, 100);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onAction]);

  return (
    <div className="flex flex-col items-center bg-zinc-900/50 p-8 rounded-[2rem] border border-blue-500/10 backdrop-blur-md">
      <div className="w-full flex justify-between mb-6 font-mono text-[10px] text-blue-500 uppercase tracking-widest">
        <span>Phase 03 // Packet_Sniffer</span>
        <span className="bg-blue-500/10 px-3 py-1 rounded-full">Packets_Captured: {score}</span>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400} 
        className="bg-black border border-white/5 rounded-xl shadow-2xl"
      />
      
      <p className="mt-6 text-[9px] text-zinc-600 uppercase italic animate-pulse">
        Use Arrow Keys to Navigate the Neural Network
      </p>
    </div>
  );
}