import { useState, useCallback, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

const PUSH_AMOUNT = 2;
const MIN_POSITION = 25; // Prevent bulls from going too far
const MAX_POSITION = 75;
const CENTER_POSITION = 50;

export const useGame = () => {
  const [leftPosition, setLeftPosition] = useState(CENTER_POSITION);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerSide, setPlayerSide] = useState<string | null>(null);

  const onGameStart = useCallback(() => {
    setGameStarted(true);
    setLeftPosition(CENTER_POSITION);
  }, []);

  const onPush = useCallback((side: string) => {
    setLeftPosition((prev) => {
      const newPosition = side === 'left' 
        ? Math.min(prev + PUSH_AMOUNT, MAX_POSITION)
        : Math.max(prev - PUSH_AMOUNT, MIN_POSITION);
      return newPosition;
    });
  }, []);

  const { push, side } = useWebSocket(onGameStart, onPush);

  useEffect(() => {
    if (side) {
      setPlayerSide(side);
    }
  }, [side]);

  const pushLeft = useCallback(() => {
    if (playerSide === 'left' && leftPosition < MAX_POSITION) {
      push('left');
    }
  }, [playerSide, leftPosition, push]);

  const pushRight = useCallback(() => {
    if (playerSide === 'right' && leftPosition > MIN_POSITION) {
      push('right');
    }
  }, [playerSide, leftPosition, push]);

  const winner = 
    leftPosition >= MAX_POSITION ? 'Red' : 
    leftPosition <= MIN_POSITION ? 'Blue' : 
    null;

  const reset = useCallback(() => {
    setLeftPosition(CENTER_POSITION);
    setGameStarted(false);
  }, []);

  const rightPosition = 100 - leftPosition; // Dynamically calculate the right bull's position

  return {
    leftPosition,
    rightPosition,
    pushLeft,
    pushRight,
    winner,
    reset,
    gameStarted,
    playerSide,
  };
};
