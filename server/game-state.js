export class GameState {
  constructor() {
    this.games = new Map();
    this.playerSides = new Map();
  }

  findAvailableGame() {
    for (const [gameId, game] of this.games.entries()) {
      if (game.players.length < 2) {
        return gameId;
      }
    }
    
    const newGameId = Math.random().toString(36).substring(7);
    this.games.set(newGameId, { players: [] });
    return newGameId;
  }

  assignPlayerSide(gameId, socketId) {
    const game = this.games.get(gameId);
    const side = game.players.length === 0 ? 'left' : 'right';
    game.players.push(socketId);
    return side;
  }

  handleDisconnect(socketId) {
    const playerData = this.playerSides.get(socketId);
    if (playerData) {
      const { gameId } = playerData;
      const game = this.games.get(gameId);
      if (game) {
        game.players = game.players.filter(p => p !== socketId);
        if (game.players.length === 0) {
          this.games.delete(gameId);
        }
      }
      this.playerSides.delete(socketId);
      return gameId;
    }
    return null;
  }

  setPlayerSide(socketId, gameId, side) {
    this.playerSides.set(socketId, { gameId, side });
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }

  getPlayerData(socketId) {
    return this.playerSides.get(socketId);
  }
}