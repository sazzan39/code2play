import React, { useState, useEffect, useRef } from 'react';

export default function PacketSnake({ onAction }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);

  const GRID_SIZE = 20;
  const CANVAS_SIZE = 300; 
  const TILE_COUNT = CANVAS_SIZE / GRID_SIZE; // 15

  const snakeRef = useRef([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const foodRef = useRef({ x: 5, y: 5 });
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
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const drawGame = () => {
      
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      // 2. Draw Food (The Green Packet)
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#22c55e';
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(
        foodRef.current.x * GRID_SIZE + 2, 
        foodRef.current.y * GRID_SIZE + 2, 
        GRID_SIZE - 4, 
        GRID_SIZE - 4
      );
      ctx.shadowBlur = 0; // Reset glow for snake

      // 3. Draw Snake
      snakeRef.current.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? '#3b82f6' : '#1d4ed8';
        ctx.fillRect(p.x * GRID_SIZE, p.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
      });

      // 4. Start Prompt
      if (directionRef.current.x === 0 && directionRef.current.y === 0) {
        ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("USE ARROWS TO INFILTRATE", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 50);
      }
    };

    const checkCollision = (head) => {
      // Wall Collision
      if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) return true;
      // Self Collision (skip the new head at index 0)
      for (let i = 1; i < snakeRef.current.length; i++) {
        if (head.x === snakeRef.current[i].x && head.y === snakeRef.current[i].y) return true;
      }
      return false;
    };

    const gameUpdate = () => {
      directionRef.current = nextDirectionRef.current;
      
      if (directionRef.current.x === 0 && directionRef.current.y === 0) {
        drawGame();
        return;
      }

      const head = { 
        x: snakeRef.current[0].x + directionRef.current.x, 
        y: snakeRef.current[0].y + directionRef.current.y 
      };

      if (checkCollision(head)) {
        onAction(false, 'snake'); 
        snakeRef.current = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
        directionRef.current = { x: 0, y: 0 }; 
        nextDirectionRef.current = { x: 0, y: 0 };
        setScore(0);
        return;
      }

      snakeRef.current.unshift(head);

      // Eat Food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => s + 1);
        onAction(true, 'snake'); 
        foodRef.current = getRandomPos();
      } else {
        snakeRef.current.pop(); 
      }
      
      drawGame();
    };

    const handleKeyDown = (e) => {
      const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (keys.includes(e.key)) {
        e.preventDefault();
        changeDirection(e.key.replace("Arrow", "").toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    gameLoopRef.current = setInterval(gameUpdate, 100); 

    // Initial Draw
    drawGame();

    return () => {
      clearInterval(gameLoopRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onAction]);

  return (
    <div className="flex flex-col items-center bg-zinc-950 p-4 sm:p-8 rounded-[2rem] border border-blue-500/20 shadow-2xl max-w-full">
      <div className="w-full flex justify-between mb-4 font-mono text-[10px] text-blue-400 uppercase">
        <span>System_Phase // 03</span>
        <span className="bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">Packets: {score}</span>
      </div>
      
      <div className="relative p-1 bg-blue-500/10 rounded-xl border border-white/5">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_SIZE} 
          height={CANVAS_SIZE} 
          className="bg-black rounded-lg block" 
        />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:hidden">
        <div />
        <button onClick={() => changeDirection('UP')} className="h-14 w-14 bg-zinc-900 rounded-xl border border-blue-500/30 flex items-center justify-center active:bg-blue-500/20">▲</button>
        <div />
        <button onClick={() => changeDirection('LEFT')} className="h-14 w-14 bg-zinc-900 rounded-xl border border-blue-500/30 flex items-center justify-center active:bg-blue-500/20">◀</button>
        <button onClick={() => changeDirection('DOWN')} className="h-14 w-14 bg-zinc-900 rounded-xl border border-blue-500/30 flex items-center justify-center active:bg-blue-500/20">▼</button>
        <button onClick={() => changeDirection('RIGHT')} className="h-14 w-14 bg-zinc-900 rounded-xl border border-blue-500/30 flex items-center justify-center active:bg-blue-500/20">▶</button>
      </div>
    </div>
  );
}