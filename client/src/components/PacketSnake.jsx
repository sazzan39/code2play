import React, { useState, useEffect, useRef } from 'react';

export default function PacketSnake({ onAction }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);

  // GAME CONFIG
  const GRID_SIZE = 20;
  const CANVAS_SIZE = 400;
  const TILE_COUNT = CANVAS_SIZE / GRID_SIZE; // 20x20 grid

  // REFS (Mutable state that doesn't trigger re-renders)
  const snakeRef = useRef([{ x: 10, y: 10 }]);
  const foodRef = useRef({ x: 15, y: 15 });
  const directionRef = useRef({ x: 0, y: 0 }); // Start stationary
  const gameLoopRef = useRef(null);

  // HELPER: Generate Random Position
  const getRandomPos = () => {
    return {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT)
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 1. INITIALIZE WITH RANDOM POSITIONS ON MOUNT
    snakeRef.current = [getRandomPos()];
    foodRef.current = getRandomPos();

    const handleKeyDown = (e) => {
      // Prevent scrolling when playing
      if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      const { x, y } = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp': if (y === 0) directionRef.current = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (y === 0) directionRef.current = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (x === 0) directionRef.current = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (x === 0) directionRef.current = { x: 1, y: 0 }; break;
        default: break;
      }
    };

    const checkCollision = (head) => {
      // Wall Collision
      if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) return true;
      // Self Collision
      for (let segment of snakeRef.current) {
        if (head.x === segment.x && head.y === segment.y) return true;
      }
      return false;
    };

    const gameUpdate = () => {
      // Calculate new head position
      const head = { 
        x: snakeRef.current[0].x + directionRef.current.x, 
        y: snakeRef.current[0].y + directionRef.current.y 
      };

      // Stop update if snake is stationary (start of game)
      if (directionRef.current.x === 0 && directionRef.current.y === 0) {
        drawGame(ctx);
        return;
      }

      // Check Death
      if (checkCollision(head)) {
        onAction(false, 'snake'); // Server Penalty
        // Reset to random spot
        snakeRef.current = [getRandomPos()];
        directionRef.current = { x: 0, y: 0 }; 
        setScore(0);
        return;
      }

      // Move Snake
      snakeRef.current.unshift(head);

      // Check Food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => s + 1);
        onAction(true, 'snake'); // Server Points
        foodRef.current = getRandomPos();
        // Don't pop() -> Snake grows
      } else {
        snakeRef.current.pop(); // Remove tail
      }

      drawGame(ctx);
    };

    const drawGame = (ctx) => {
      // Background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Snake (Blue)
      ctx.fillStyle = '#2563eb'; 
      snakeRef.current.forEach(p => 
        ctx.fillRect(p.x * GRID_SIZE, p.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2)
      );

      // Food (Green)
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(foodRef.current.x * GRID_SIZE, foodRef.current.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    };

    window.addEventListener('keydown', handleKeyDown);
    gameLoopRef.current = setInterval(gameUpdate, 100); // 10 FPS

    return () => {
      clearInterval(gameLoopRef.current);
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
        Use Arrow Keys to Navigate. Avoid Firewalls.
      </p>
    </div>
  );
}