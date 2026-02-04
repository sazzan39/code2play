import React, { useState, useEffect, useCallback } from 'react';

export default function SnakeGame({ onComplete }) {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState({ x: 0, y: -1 });
  const [score, setScore] = useState(0);

  const moveSnake = useCallback(() => {
    setSnake(prev => {
      const newHead = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
      
      // Wall Collision or Self-Hit (Reset score or just continue for classroom)
      if (newHead.x < 0 || newHead.x >= 20 || newHead.y < 0 || newHead.y >= 20) return [{ x: 10, y: 10 }];

      const newSnake = [newHead, ...prev.slice(0, -1)];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        setFood({ x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) });
        return [newHead, ...prev];
      }
      return newSnake;
    });
  }, [dir, food]);

  useEffect(() => {
    const handleKeys = (e) => {
      if (e.key === 'ArrowUp') setDir({ x: 0, y: -1 });
      if (e.key === 'ArrowDown') setDir({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft') setDir({ x: -1, y: 0 });
      if (e.key === 'ArrowRight') setDir({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKeys);
    const interval = setInterval(moveSnake, 150);
    return () => { clearInterval(interval); window.removeEventListener('keydown', handleKeys); };
  }, [moveSnake]);

  useEffect(() => {
    if (score >= 5) onComplete(); // Requirement to move to Phase 4
  }, [score, onComplete]);

  return (
    <div className="relative border-4 border-white/10 bg-black w-[300px] h-[300px] grid grid-cols-20 grid-rows-20">
      {snake.map((p, i) => (
        <div key={i} className="bg-green-500 rounded-sm" style={{ gridColumnStart: p.x + 1, gridRowStart: p.y + 1 }} />
      ))}
      <div className="bg-red-500 animate-pulse rounded-full" style={{ gridColumnStart: food.x + 1, gridRowStart: food.y + 1 }} />
      <div className="absolute top-2 left-2 text-[10px] font-mono">FRAGMENTS: {score}/5</div>
    </div>
  );
}