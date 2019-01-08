export type Type = 'i' | 'j' | 'l' | 'o' | 's' | 't' | 'z';
type State = 0 | 1 | 2 | 3;

class Piece {
  readonly x: number;
  readonly y: number;
  readonly type: Type;
  readonly state: State;

  constructor(x: number, y: number, type: Type, state : State = 0) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.state = state;
  }

  public rotate() {
    let newState : State = 0;
    if (this.state === 0) {
      newState = 3;
    } else if (this.state === 1) {
      newState = 0;
    } else if (this.state === 2) {
      newState = 1;
    } else if (this.state === 3) {
      newState = 2;
    }

    return new Piece(this.x, this.y, this.type, newState);
  }

  public move(deltaX: number, deltaY: number) {
    return new Piece(this.x + deltaX, this.y + deltaY, this.type, this.state);
  }

  public getCells(): boolean[][] {
    if (this.type === 'i') {
      if (this.state === 1 || this.state === 3) {
        return [[true], [true], [true], [true]];
      }
      return [[true, true, true, true]];
    }
    if (this.type === 'j') {
      if (this.state === 0) {
        return [[true, true, true], [false, false, true]];
      }
      if (this.state === 1) {
        return [[false, true], [false, true], [true, true]];
      }
      if (this.state === 2) {
        return [[true, false, false], [true, true, true]];
      }
      return [[true, true], [true, false], [true, false]];
    }
    if (this.type === 'l') {
      if (this.state === 0) {
        return [[true, true, true], [true, false, false]];
      }
      if (this.state === 1) {
        return [[true, true], [false, true], [false, true]];
      }
      if (this.state === 2) {
        return [[false, false, true], [true, true, true]];
      }
      return [[true, false], [true, false], [true, true]];
    }
    if (this.type === 'o') {
      return [[true, true], [true, true]];
    }
    if (this.type === 's') {
      if (this.state === 0 || this.state === 2) {
        return [[false, true, true], [true, true, false]];
      }
      if (this.state === 1 || this.state === 3) {
        return [[true, false], [true, true], [false, true]];
      }
    }
    if (this.type === 'z') {
      if (this.state === 0 || this.state === 2) {
        return [[true, true, false], [false, true, true]];
      }
      if (this.state === 1 || this.state === 3) {
        return [[false, true], [true, true], [true, false]];
      }
    }
    if (this.type === 't') {
      if (this.state === 0) {
        return [[true, true, true], [false, true, false]];
      }
      if (this.state === 1) {
        return [[false, true], [true, true], [false, true]];
      }
      if (this.state === 2) {
        return [[false, true, false], [true, true, true]];
      }
      return [[true, false], [true, true], [true, false]];
    }
    return [[]];
  }
}

export default Piece;
