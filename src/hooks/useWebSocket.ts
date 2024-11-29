import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export const useWebSocket = (onGameStart: (data: any) => void, onPush: (side: string) => void) => {
  const socketRef = useRef<Socket | null>(null);
  const gameIdRef = useRef<string | null>(null);
  const sideRef = useRef<string | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('gameJoined', ({ gameId, side }) => {
      gameIdRef.current = gameId;
      sideRef.current = side;
    });

    socketRef.current.on('gameStart', onGameStart);
    socketRef.current.on('pushed', ({ side }) => onPush(side));
    socketRef.current.on('playerLeft', () => {
      // Handle player disconnection
    });

    socketRef.current.emit('joinGame');

    return () => {
      socketRef.current?.disconnect();
    };
  }, [onGameStart, onPush]);

  const push = useCallback(() => {
    if (socketRef.current && sideRef.current) {
      socketRef.current.emit('push');
    }
  }, []);

  return {
    push,
    side: sideRef.current,
    gameId: gameIdRef.current
  };
};