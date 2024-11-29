import { useState, useCallback, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

const PUSH_AMOUNT = 2;
const MIN_POSITION = 10;
const MAX_POSITION = 90;
const CENTER_POSITION = 50;

export const useGame = () => {
  const [leftPosition, setLeftPosition] = useState(CENTER_POSITION);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerSide, setPlayerSide] = useState<string | null>(null);

  const onGameStart = useCallback((data: any) => {
    setGameStarted(true);
    setLeftPosition(CENTER_POSITION);
  }, []);

  const onPush = useCallback((side: string) => {
    setLeftPosition(prev => {
      if (side === 'left') {
        return Math.min(prev + PUSH_AMOUNT, MAX_POSITION);
      } else {
        return Math.max(prev - PUSH_AMOUNT, MIN_POSITION);
      }
    });
  }, []);

  const { push, side } = useWebSocket(onGameStart, onPush);

  useEffect(() => {
    if (side) {
      setPlayerSide(side);
    }
  }, [side]);

  const pushLeft = useCallback(() => {
    if (playerSide === 'left') {
      push();
    }
  }, [playerSide, push]);

  const pushRight = useCallback(() => {
    if (playerSide === 'right') {
      push();
    }
  }, [playerSide, push]);

  const winner = leftPosition >= MAX_POSITION ? 'Red' : 
                leftPosition <= MIN_POSITION ? 'Blue' : 
                null;

  const reset = useCallback(() => {
    setLeftPosition(CENTER_POSITION);
    setGameStarted(false);
  }, []);

  return {
    leftPosition,
    pushLeft,
    pushRight,
    winner,
    reset,
    gameStarted,
    playerSide
  };
};