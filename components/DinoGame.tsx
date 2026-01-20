'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/lib/store';
import { getSocket } from '@/app/providers';

interface DinoGameProps {
  onClose: () => void;
}

export default function DinoGame({ onClose }: DinoGameProps) {
  const userName = useChatStore((state) => state.userName);
  const addGameScore = useChatStore((state) => state.addGameScore);
  
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [obstacles, setObstacles] = useState<{ id: number; x: number }[]>([]);
  const [dinoY, setDinoY] = useState(0);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);
  const difficultyRef = useRef(1);
  const gameStateRef = useRef({
    dinoY: 0,
    isJumping: false,
    score: 0,
    gameOver: false,
    gameStarted: false,
    obstacles: [] as { id: number; x: number }[],
    velocity: 0,
    lastSpawn: Date.now(),
  });
  const obstacleIdRef = useRef(0);

  const GRAVITY = 0.5;
  const JUMP_STRENGTH = 12;
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 300;
  const GROUND_Y = 240;
  const DINO_SIZE = 30;
  const DINO_X = 50;
  const OBSTACLE_WIDTH = 20;
  const OBSTACLE_HEIGHT = 40;

  const handleJump = () => {
    if (!gameStateRef.current.isJumping && !gameStateRef.current.gameOver && gameStateRef.current.gameStarted) {
      gameStateRef.current.isJumping = true;
      velocityRef.current = -JUMP_STRENGTH;
      setIsJumping(true);
    }
  };

  const startGame = () => {
    obstacleIdRef.current = 0;
    gameStateRef.current = {
      dinoY: 0,
      isJumping: false,
      score: 0,
      gameOver: false,
      gameStarted: true,
      obstacles: [],
      velocity: 0,
      lastSpawn: Date.now(),
    };
    velocityRef.current = 0;
    difficultyRef.current = 1;
    setScore(0);
    setDinoY(0);
    setIsJumping(false);
    setGameOver(false);
    setGameStarted(true);
    setObstacles([]);
  };

  const submitScore = () => {
    const finalScore = gameStateRef.current.score;
    const socket = getSocket();
    socket?.emit('submitGameScore', { score: finalScore, userName });
    addGameScore({ userId: userName, userName, score: finalScore, timestamp: Date.now() });
    onClose();
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      gameStateRef.current.velocity += GRAVITY;
      gameStateRef.current.dinoY += gameStateRef.current.velocity;

      // Ground collision
      if (gameStateRef.current.dinoY >= 0) {
        gameStateRef.current.dinoY = 0;
        gameStateRef.current.velocity = 0;
        gameStateRef.current.isJumping = false;
        setIsJumping(false);
      }

      // Update difficulty
      difficultyRef.current = 1 + gameStateRef.current.score * 0.05;

      // Move obstacles
      gameStateRef.current.obstacles = gameStateRef.current.obstacles
        .map((obs) => ({ ...obs, x: obs.x - 8 * difficultyRef.current }))
        .filter((obs) => obs.x > -OBSTACLE_WIDTH);

      // Collision detection
      gameStateRef.current.obstacles.forEach((obs) => {
        const dinoLeft = DINO_X;
        const dinoRight = DINO_X + DINO_SIZE;
        const dinoTop = GROUND_Y + gameStateRef.current.dinoY;
        const dinoBottom = GROUND_Y + gameStateRef.current.dinoY + DINO_SIZE;

        const obsLeft = obs.x;
        const obsRight = obs.x + OBSTACLE_WIDTH;
        const obsTop = GROUND_Y;
        const obsBottom = GROUND_Y + OBSTACLE_HEIGHT;

        if (dinoRight > obsLeft && dinoLeft < obsRight && dinoBottom > obsTop && dinoTop < obsBottom) {
          gameStateRef.current.gameOver = true;
          setGameOver(true);
        }
      });

      // Spawn obstacles
      const now = Date.now();
      const spawnRate = Math.max(1000, 2500 / difficultyRef.current);
      if (now - gameStateRef.current.lastSpawn > spawnRate) {
        gameStateRef.current.obstacles.push({
          id: obstacleIdRef.current++,
          x: GAME_WIDTH,
        });
        gameStateRef.current.lastSpawn = now;
      }

      // Increase score
      gameStateRef.current.score += 1;

      setScore(gameStateRef.current.score);
      setDinoY(gameStateRef.current.dinoY);
      setObstacles([...gameStateRef.current.obstacles]);
    }, 30);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameStateRef.current.gameStarted) {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-amber-900 to-black rounded-2xl p-8 w-full max-w-2xl border border-white/20 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2">🦖 Dino Runner</h2>
        <p className="text-white/60 mb-6">Press SPACE or click to jump!</p>

        {!gameStarted ? (
          <div className="text-center space-y-4">
            <p className="text-white text-lg">Ready to play?</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div
            className="relative bg-gradient-to-b from-sky-200 to-sky-100 rounded-lg overflow-hidden border-4 border-white cursor-pointer"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            onClick={handleJump}
            ref={canvasRef}
          >
            {/* Ground */}
            <div className="absolute bottom-0 w-full h-12 bg-gradient-to-b from-yellow-600 to-yellow-700" />

            {/* Dino */}
            <div
              className="absolute w-8 h-8 text-3xl transition-all flex items-center justify-center"
              style={{
                left: DINO_X,
                bottom: GROUND_Y + dinoY,
              }}
            >
              🦖
            </div>

            {/* Obstacles */}
            {obstacles.map((obs) => (
              <div
                key={obs.id}
                className="absolute bg-red-600 rounded"
                style={{
                  left: obs.x,
                  bottom: GROUND_Y,
                  width: OBSTACLE_WIDTH,
                  height: OBSTACLE_HEIGHT,
                }}
              />
            ))}

            {/* Score */}
            <div className="absolute top-4 left-4 text-2xl font-bold text-black">
              Score: {score}
            </div>

            {gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded">
                <p className="text-4xl font-bold text-white mb-4 animate-bounce">Game Over!</p>
                <p className="text-2xl text-yellow-300 mb-8">
                  Final Score: {score}
                </p>
                <div className="space-x-4">
                  <button
                    onClick={startGame}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded transition active:scale-95 hover:scale-105"
                    aria-label="Play again"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={submitScore}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded transition active:scale-95 hover:scale-105"
                    aria-label="Submit score"
                  >
                    Submit Score
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition active:scale-95 hover:scale-102"
          aria-label="Close game"
        >
          Close
        </button>
      </div>
    </div>
  );
}
