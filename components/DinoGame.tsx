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
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const spawnObstacleRef = useRef<NodeJS.Timeout | null>(null);
  const obstacleIdRef = useRef(0);
  const velocityRef = useRef(0);
  const difficultyRef = useRef(1); // Difficulty multiplier

  const GRAVITY = 0.6;
  const JUMP_STRENGTH = 15;
  const GAME_WIDTH = 800;
  const GROUND_Y = 300;
  const OBSTACLE_WIDTH = 20;
  const OBSTACLE_HEIGHT = 40;

  const handleJump = () => {
    if (!isJumping && !gameOver && gameStarted) {
      setIsJumping(true);
      velocityRef.current = -JUMP_STRENGTH;
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setDinoY(0);
    velocityRef.current = 0;
    obstacleIdRef.current = 0;
    difficultyRef.current = 1;
  };

  const submitScore = () => {
    const finalScore = Math.floor(score / 10);
    const socket = getSocket();
    socket?.emit('submitGameScore', { score: finalScore, userName });
    addGameScore({ userId: userName, userName, score: finalScore, timestamp: Date.now() });
    onClose();
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      // Physics
      velocityRef.current += GRAVITY;
      setDinoY((prev) => {
        const newY = prev + velocityRef.current;
        if (newY >= 0) {
          setIsJumping(false);
          return 0;
        }
        return newY;
      });

      // Obstacle movement and collision
      setObstacles((prev) => {
        const updated = prev
          .map((obs) => ({ ...obs, x: obs.x - 8 * difficultyRef.current }))
          .filter((obs) => obs.x > -OBSTACLE_WIDTH);

        // Collision detection
        updated.forEach((obs) => {
          if (
            obs.x < 40 + 30 &&
            obs.x + OBSTACLE_WIDTH > 40 &&
            dinoY + 30 < GROUND_Y + OBSTACLE_HEIGHT
          ) {
            setGameOver(true);
          }
        });

        return updated;
      });

      // Increase difficulty over time
      const currentScore = Math.floor(score / 10);
      difficultyRef.current = 1 + currentScore * 0.05; // Gradually increase speed

      setScore((prev) => prev + 1);
    }, 30);

    return () => clearInterval(gameLoopRef.current as NodeJS.Timeout);
  }, [gameStarted, gameOver, dinoY, score]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    spawnObstacleRef.current = setInterval(() => {
      setObstacles((prev) => [
        ...prev,
        { id: obstacleIdRef.current++, x: GAME_WIDTH },
      ]);
    }, Math.max(1500, 3000 / difficultyRef.current)); // Spawn faster as difficulty increases

    return () => clearInterval(spawnObstacleRef.current as NodeJS.Timeout);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isJumping, gameOver, gameStarted]);

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
            style={{ width: GAME_WIDTH, height: 400 }}
            onClick={handleJump}
          >
            {/* Ground */}
            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-b from-yellow-600 to-yellow-700" />

            {/* Dino */}
            <div
              className="absolute left-10 w-8 h-8 bg-green-600 rounded transition-all"
              style={{
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
              Score: {Math.floor(score / 10)}
            </div>

            {gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded">
                <p className="text-4xl font-bold text-white mb-4 animate-bounce">Game Over!</p>
                <p className="text-2xl text-yellow-300 mb-8">
                  Final Score: {Math.floor(score / 10)}
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
