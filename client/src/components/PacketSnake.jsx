import React, { useState, useEffect, useRef } from 'react';

export default function PacketSnake({ onAction }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);

  // constants

  const GRID_SIZE = 20;
  const CANVAS_SIZE = 300; 
  const TILE_COUNT = CANVAS_SIZE / GRID_SIZE; 

  // refs for game
  const snakeRef = useRef([{ x: 10, y: 10 }]);
  const foodRef = useRef({ x: 15, y: 15 });
  const directionRef = useRef({ x: 0, y: 0 }); 
  const nextDirectionRef = useRef({ x: 0, y: 0 });
  const gameLoopRef = useRef(null);

  const getRandomPos = () => ({
    x: Math.floor(Math.random() * TILE_COUNT),
    y: Math.floor(Math.random() * TILE_COUNT)
  });

  
  const changeDirection = (newDir) => {
    const currentDir = directionRef.current;
    if (newDir === 'UP' && currentDir.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
    if (newDir === 'DOWN' && currentDir.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
    if (newDir === 'LEFT' && currentDir.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
    if (newDir === 'RIGHT' && currentDir.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleKeyDown = (e) => {
      if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
      const dirMap = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT' };
      if (dirMap[e.key]) changeDirection(dirMap[e.key]);
    };

    const checkCollision = (head) => {
      if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) return true;
      for (let i = 0; i < snakeRef.current.length - 1; i++) {
        if (head.x === snakeRef.current[i].x && head.y === snakeRef.current[i].y) return true;
      }
      return false;
    };

    const gameUpdate = () => {
      directionRef.current = nextDirectionRef.current;
      const head = { 
        x: snakeRef.current[0].x + directionRef.current.x, 
        y: snakeRef.current[0].y + directionRef.current.y 
      };

      if (directionRef.current.x === 0 && directionRef.current.y === 0) {
        drawGame(ctx);
        return;
      }

      if (checkCollision(head)) {
        onAction(false, 'snake'); 
        snakeRef.current = [{ x: 5, y: 5 }];
        directionRef.current = { x: 0, y: 0 }; 
        nextDirectionRef.current = { x: 0, y: 0 };
        setScore(0);
        return;
      }

      snakeRef.current.unshift(head);
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => s + 1);
        onAction(true, 'snake'); 
        foodRef.current = getRandomPos();
      } else {
        snakeRef.current.pop(); 
      }
      drawGame(ctx);
    };

    const drawGame = (ctx) => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      // Snake
      snakeRef.current.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? '#3b82f6' : '#1d4ed8';
        ctx.fillRect(p.x * GRID_SIZE, p.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
      });

      // Food
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(foodRef.current.x * GRID_SIZE + 4, foodRef.current.y * GRID_SIZE + 4, GRID_SIZE - 8, GRID_SIZE - 8);
    };

    window.addEventListener('keydown', handleKeyDown);
    gameLoopRef.current = setInterval(gameUpdate, 100); 

    return () => {
      clearInterval(gameLoopRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onAction]);

  return (
    <div className="flex flex-col items-center bg-zinc-950 p-4 sm:p-8 rounded-[2rem] border border-blue-500/20 shadow-2xl max-w-full">
      <div className="w-full flex justify-between mb-4 font-mono text-[10px] text-blue-400 uppercase">
        <span>Phase_03 // Sniffer</span>
        <span className="bg-blue-500/10 px-2 py-1 rounded-full">Score: {score}</span>
      </div>
      
      <canvas ref={canvasRef} width={300} height={300} className="bg-black rounded-lg border border-white/5 shadow-inner" />

      {/* MOBILE CONTROLS  */}
      <div className="mt-8 grid grid-cols-3 gap-2 sm:hidden">
        <div />
        <button onClick={() => changeDirection('UP')} className="h-14 w-14 bg-zinc-800 rounded-xl border border-blue-500/30 flex items-center justify-center active:bg-blue-600">▲</button>
        <div />
        <button onClick={() => changeDirection('LEFT')} className="h-14 w-14 bg-zinc-800 rounded-xl border border-blue-500/30 flex items-center justify-center active:bg-blue-600">◀</button>
        <button onClick={() => changeDirection('DOWN')} className="h-14 w-14 bg-zinc-800 rounded-xl border border-blue-500/30 flex items-center justify-center active:bg-blue-600">▼</button>
        <button onClick={() => changeDirection('RIGHT')} className="h-14 w-14 bg-zinc-800 rounded-xl border border-blue-500/30 flex items-center justify-center active:bg-blue-600">▶</button>
      </div>

      <p className="mt-4 text-[8px] text-zinc-600 uppercase font-mono hidden sm:block">
        Use Arrow Keys to Intercept Packets
      </p>
    </div>
  );
}