export class Square {
  constructor(x, y, display, bombChance) {
    this.neighborBombs = 0;
    this.x = x;
    this.y = y;
    this.display = display;
    this.bomb = Math.random() < bombChance;
  }
}
export const SquareStates = {
  UNCLICKED: 'unclicked',
  CLICKED: 'clicked',
  EMPTY: 'empty',
  BOMB: 'bomb',
};
