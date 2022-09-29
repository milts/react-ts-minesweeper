import React from 'react';
import { useState } from 'react';
import { Square, SquareStates } from './Square.js';
import './board.css';

export default function Board(props) {
  const initState = (w, h, bombChance) => {
    let board = [];
    let bombCount = 0;
    for (let y = 0; y < h; y++) {
      let row = [];
      for (let x = 0; x < w; x++) {
        let newSquare = new Square(x, y, SquareStates.UNCLICKED, bombChance);
        if (newSquare.bomb) {
          bombCount++;
        }
        row.push(newSquare);
      }
      board.push(row);
    }
    return {
      board: board,
      bombs: bombCount,
      clickCount: 0,
    };
  };
  const [state, setState] = useState(initState(props.w, props.h, 0.1));
  const resetBoard = () => setState(initState(props.w, props.h, 0.1));

  const neighborsFnHelper = (x, y, fnRef) => {
    let left = Math.max(0, x - 1);
    let right = Math.min(props.w - 1, x + 1);
    let top = Math.max(0, y - 1);
    let bottom = Math.min(props.h - 1, y + 1);
    //
    for (let neighborX = left; neighborX <= right; neighborX++) {
      for (let neighborY = top; neighborY <= bottom; neighborY++) {
        if (!(x === neighborX && y === neighborY)) {
          fnRef(neighborX, neighborY);
        }
      }
    }
  };
  const handleClick = (x, y) => {
    let square = state.board[y][x];
    if (
      square.display !== SquareStates.UNCLICKED ||
      props.isClickable === false
    ) {
      return;
    }
    if (square.bomb) {
      square.display = SquareStates.BOMB;
      props.onGameOver(false);
    } else {
      square.neighborBombs = countNeighborBombs(x, y);
      square.display =
        square.neighborBombs === 0 ? SquareStates.EMPTY : SquareStates.CLICKED;
      tempClickCount++;
    }
    if (square.display === SquareStates.EMPTY) {
      neighborsFnHelper(x, y, (neighborX, neighorY) => {
        if (
          state.board[neighorY][neighborX].display === SquareStates.UNCLICKED
        ) {
          handleClick(neighborX, neighorY);
        }
      });
    }
    if (tempClickCount === props.w * props.h - state.bombs) {
      props.onGameOver(true);
    }
    setState({ ...state, clickCount: tempClickCount });
  };

  const countNeighborBombs = (x, y) => {
    let count = 0;
    neighborsFnHelper(x, y, (neighborX, neighborY) => {
      if (state.board[neighborY][neighborX].bomb) {
        count++;
      }
    });
    return count;
  };

  const getButtonContent = (square) => {
    if (square.display === SquareStates.UNCLICKED) return '-';
    if (square.display === SquareStates.BOMB) return 'X';
    return square.neighborBombs.toString();
  };

  props.resetFnRef.current = resetBoard;
  let tempClickCount = state.clickCount;

  return (
    <div>
      <div className="board">
        {state.board.map((row, y) => (
          <>
            {row.map((square, x) => (
              <button
                className={square.display}
                onClick={() => handleClick(x, y)}
              >
                {getButtonContent(square)}
              </button>
            ))}
            <br />
          </>
        ))}
      </div>
    </div>
  );
}
