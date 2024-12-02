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
  const [leftClicks, setLeftClicks] = useState(0);
  const [rightClicks, setRightClicks] = useState(0);

  const onGameStart = useCallback(() => {
    setGameStarted(true);
    setLeftPosition(CENTER_POSITION);
    setLeftClicks(0);
    setRightClicks(0);
  }, []);

  const onPush = useCallback((side: string) => {
    setLeftPosition((prev) => {
      const newPosition = side === 'left' 
        ? Math.min(prev + PUSH_AMOUNT, MAX_POSITION)
        : Math.max(prev - PUSH_AMOUNT, MIN_POSITION);
      return newPosition;
    });
        // Increment the click count based on the side
        if (side === 'left') {
          setLeftClicks((prev) => prev + 1);
        } else if (side === 'right') {
          setRightClicks((prev) => prev + 1);
        }
  }, []);

  const { push, side } = useWebSocket(onGameStart, onPush);

  useEffect(() => {
    if (side) {
      setPlayerSide(side);
    }
  }, [side]);

  const pushLeft = useCallback(() => {
    if (playerSide === 'left' && leftPosition < MAX_POSITION) {
      push();
    }
  }, [playerSide, leftPosition, push]);

  const pushRight = useCallback(() => {
    if (playerSide === 'right' && leftPosition > MIN_POSITION) {
      push();
    }
  }, [playerSide, leftPosition, push]);

  const winner = 
    leftPosition >= MAX_POSITION ? 'Red' : 
    leftPosition <= MIN_POSITION ? 'Blue' : 
    null;

  const reset = useCallback(() => {
    setLeftPosition(CENTER_POSITION);
    setGameStarted(false);
    setLeftClicks(0);
    setRightClicks(0);
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
    leftClicks,
    rightClicks,
  };
};
