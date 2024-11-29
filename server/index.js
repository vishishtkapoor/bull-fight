import { createServer } from 'http';
import { Server } from 'socket.io';
import { GameState } from './game-state.js';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

const gameState = new GameState();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinGame', () => {
    const gameId = gameState.findAvailableGame();
    const side = gameState.assignPlayerSide(gameId, socket.id);
    
    socket.join(gameId);
    gameState.setPlayerSide(socket.id, gameId, side);
    
    const game = gameState.getGame(gameId);
    if (game.players.length === 2) {
      io.to(gameId).emit('gameStart', {
        players: game.players.map(p => ({ 
          id: p, 
          side: gameState.getPlayerData(p).side 
        }))
      });
    }
    
    socket.emit('gameJoined', { gameId, side });
  });

  socket.on('push', () => {
    const playerData = gameState.getPlayerData(socket.id);
    if (!playerData) return;

    const { gameId, side } = playerData;
    io.to(gameId).emit('pushed', { side });
  });

  socket.on('disconnect', () => {
    const gameId = gameState.handleDisconnect(socket.id);
    if (gameId) {
      io.to(gameId).emit('playerLeft');
    }
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});