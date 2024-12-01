import { Bull } from './components/Bull';
import { GameArea } from './components/GameArea';
import { useGame } from './hooks/useGame';
import { Trophy, Loader2 } from 'lucide-react';

function App() {
  const {
    leftPosition,
    rightPosition,
    pushLeft,
    pushRight,
    winner,
    reset,
    gameStarted,
    playerSide,
  } = useGame();

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <GameArea
        leftPosition={leftPosition}
        rightPosition={rightPosition}
        onLeftClick={pushLeft}
        onRightClick={pushRight}
      />

      {/* Bulls */}
      <Bull position={leftPosition} />
      <Bull position={rightPosition} isFlipped />

      {/* Winner Modal */}
      {winner && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h2 className="text-2xl font-bold mb-4">{winner} Bull Wins!</h2>
            <button
              onClick={reset}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Waiting for Opponent */}
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-indigo-600 animate-spin" />
            <h2 className="text-2xl font-bold mb-4">Waiting for opponent...</h2>
          </div>
        </div>
      )}

      {/* Game Info */}
      {gameStarted && !winner && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg">
          <p className="text-lg font-semibold text-gray-800">
            You are the {playerSide === 'left' ? 'Red' : 'Blue'} Bull!
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
