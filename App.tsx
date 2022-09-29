import * as React from 'react';
import { useState, useRef } from 'react';
import './style.css';
import Board from './game/Board.js';

export default function App() {
  const boardResetFnRef = useRef(null);
  const [gameState, setGameState] = useState({ active: true, winner: false });
  const gameOver = (userWon) => {
    setGameState({ active: false, winner: userWon });
  };
  const resetGame = () => {
    boardResetFnRef.current();
    setGameState({ active: true, winner: false });
  };
  return (
    <div>
      <dialog open={!gameState.active}>
        <p>Game Over.</p>
        <p>You {gameState.winner ? 'Won!' : 'Lost!'}</p>
        <button onClick={resetGame}>Start Again</button>
      </dialog>
      <Board
        w={12}
        h={15}
        isClickable={gameState.active}
        onGameOver={gameOver}
        resetFnRef={boardResetFnRef}
      />
    </div>
  );
}
