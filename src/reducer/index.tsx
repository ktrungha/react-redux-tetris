import { ActionType, createAction, getType } from 'typesafe-actions';
import Piece from '../components/Piece';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../constants';
import { merge } from '../logic';

export const newGame = createAction('newGame');

export const setupGame = createAction('setupGame', resolve => (piece: Piece, nextPiece: Piece) =>
  resolve({ piece, nextPiece }),
);

export const endGame = createAction('endGame');

export const movePiece = createAction('movePiece', resolve => (deltaX: number, deltaY: number) =>
  resolve({ deltaX, deltaY }),
);

export const nextPieceEnters = createAction(
  'nextPiece',
  resolve => (nextPiece: Piece, piece: Piece) => resolve({ nextPiece, piece }),
);

export const rotate = createAction('rotate');

export const land = createAction('land');

export const score = createAction('score');

export interface State {
  content: string[][];
  piece?: Piece;
  nextPiece?: Piece;
  score: number;
}

const actions = { newGame, setupGame, movePiece, land, nextPieceEnters, rotate, score };

type Action = ActionType<typeof actions>;

const emptyContent: string[][] = [];
for (let i = 0; i < BOARD_HEIGHT; i += 1) {
  const row: string[] = [];
  for (let j = 0; j < BOARD_WIDTH; j += 1) {
    row.push('');
  }

  emptyContent.push(row);
}

export default function(state: State = { content: emptyContent, score: 0 }, action: Action) {
  switch (action.type) {
    case getType(setupGame): {
      return {
        ...state,
        content: emptyContent,
        score: 0,
        piece: action.payload.piece,
        nextPiece: action.payload.nextPiece,
      };
    }
    case getType(movePiece): {
      let piece = state.piece;
      if (piece) {
        const cells = piece.getCells();
        let move = true;
        for (let i = 0; i < cells.length && move; i += 1) {
          for (let j = 0; j < cells[0].length && move; j += 1) {
            if (
              piece.y + i + action.payload.deltaY < 0 ||
              piece.x + j + action.payload.deltaX < 0 ||
              piece.x + j + action.payload.deltaX >= BOARD_WIDTH
            ) {
              move = false;
            } else if (
              state.content[piece.y + i + action.payload.deltaY]
                [piece.x + j + action.payload.deltaX] &&
              cells[i][j]
            ) {
              move = false;
            }
          }
        }

        if (move) {
          piece = piece.move(action.payload.deltaX, action.payload.deltaY);
        }
      }

      return {
        ...state,
        piece,
      };
    }
    case getType(land): {
      const content = merge(state.content, state.piece);
      return { ...state, content };
    }
    case getType(nextPieceEnters): {
      return {
        ...state,
        piece: action.payload.piece,
        nextPiece: action.payload.nextPiece,
      };
    }
    case getType(rotate): {
      let piece = state.piece;
      if (piece) {
        const rotatedPiece = piece.rotate();
        const cells = rotatedPiece.getCells();
        let rotate = true;
        for (let i = 0; i < cells.length && rotate; i += 1) {
          for (let j = 0; j < cells[0].length && rotate; j += 1) {
            if (
              rotatedPiece.y + i >= BOARD_HEIGHT ||
              rotatedPiece.x + j < 0 ||
              rotatedPiece.x + j >= BOARD_WIDTH
            ) {
              rotate = false;
            } else if (state.content[rotatedPiece.y + i][rotatedPiece.x + j] && cells[i][j]) {
              rotate = false;
            }
          }
        }

        if (rotate) {
          piece = rotatedPiece;
        }
      }

      return {
        ...state,
        piece,
      };
    }
    case getType(score): {
      const content = state.content;
      let count = 0;
      const scoringRows = [];
      for (let i = 0; i < BOARD_HEIGHT; i += 1) {
        const row = content[i];
        let full = true;
        for (let j = 0; j < row.length && full; j += 1) {
          if (!row[j]) {
            full = false;
          }
        }

        if (full) {
          count += 1;
          scoringRows.push(i);
        }
      }

      let score = state.score;
      if (count === 1) {
        score += 10;
      } else if (count === 2) {
        score += 20;
      } else if (count === 3) {
        score += 40;
      } else if (count === 4) {
        score += 80;
      }

      const newContent = [] as string[][];
      for (let i = 0; i < content.length; i += 1) {
        if (scoringRows.indexOf(i) < 0) {
          newContent.push(content[i]);
        }
      }
      for (let i = 0; i < scoringRows.length; i += 1) {
        const row = [] as string[];
        for (let j = 0; j < BOARD_WIDTH; j += 1) {
          row.push('');
        }
        newContent.push(row);
      }

      return {
        ...state,
        score,
        content: newContent,
      };
    }
    default:
      return state;
  }
}
