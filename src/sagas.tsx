import { SagaIterator, delay } from 'redux-saga';
import { takeEvery, put, fork, take, cancel, call, select } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import {
  newGame,
  setupGame,
  endGame,
  movePiece,
  State,
  nextPieceEnters,
  land,
  score,
} from './reducer';
import { genPieceType } from './logic';
import Piece from './components/Piece';
import { BOARD_WIDTH, BOARD_HEIGHT } from './constants';

function* newGameSaga(): SagaIterator {
  const pieceType = genPieceType();
  let piece: Piece;
  if (pieceType === 'i') {
    piece = new Piece(BOARD_WIDTH / 2 - 2, BOARD_HEIGHT - 1, pieceType);
  } else {
    piece = new Piece(BOARD_WIDTH / 2 - 1, BOARD_HEIGHT - 2, pieceType);
  }

  const nextPieceType = genPieceType();
  let nextPiece: Piece;
  if (nextPieceType === 'i') {
    nextPiece = new Piece(0, 0, nextPieceType);
  } else {
    nextPiece = new Piece(1, 0, nextPieceType);
  }

  yield put({ type: getType(setupGame), payload: { piece, nextPiece } });

  const progressTask = yield fork(progressGameSaga);
  yield take(getType(endGame));

  yield cancel(progressTask);
}

function* progressGameSaga(): SagaIterator {
  while (true) {
    yield call(delay, 500);

    let data: { content: boolean[][]; piece: Piece; nextPiece: Piece } = yield select(
      (state: State) => {
        return { content: state.content, piece: state.piece, nextPiece: state.nextPiece };
      },
    );

    let pieceCells = data.piece.getCells();
    let landed = false;
    for (let i = 0; i < pieceCells.length && !landed; i += 1) {
      for (let j = 0; j < pieceCells[0].length && !landed; j += 1) {
        if (data.piece.y - 1 + i < 0) {
          landed = true;
        } else if (pieceCells[i][j] && data.content[data.piece.y - 1 + i][data.piece.x + j]) {
          landed = true;
        }
      }
    }

    if (landed) {
      const nextPieceType = genPieceType();
      let nextPiece: Piece;
      if (nextPieceType === 'i') {
        nextPiece = new Piece(0, 0, nextPieceType);
      } else {
        nextPiece = new Piece(1, 0, nextPieceType);
      }

      let piece: Piece;
      if (data.nextPiece.type === 'i') {
        piece = new Piece(BOARD_WIDTH / 2 - 2, BOARD_HEIGHT - 1, data.nextPiece.type);
      } else {
        piece = new Piece(BOARD_WIDTH / 2 - 1, BOARD_HEIGHT - 2, data.nextPiece.type);
      }

      yield put({ type: getType(land) });

      yield put({ type: getType(score) });

      yield put({ type: getType(nextPieceEnters), payload: { nextPiece, piece } });

      // check if new piece collides with current cells
      data = yield select((state: State) => {
        return { content: state.content, piece: state.piece, nextPiece: state.nextPiece };
      });
      let collided = false;
      pieceCells = data.piece.getCells();
      for (let i = 0; i < pieceCells.length && !collided; i += 1) {
        for (let j = 0; j < pieceCells[0].length && !collided; j += 1) {
          if (data.content[data.piece.y + i][data.piece.x + j]) {
            collided = true;
          }
        }
      }
      if (collided) {
        yield put({ type: getType(endGame) });
      }
    } else {
      yield put({ type: getType(movePiece), payload: { deltaX: 0, deltaY: -1 } });
    }
  }
}

export default function* rootSaga(): SagaIterator {
  yield takeEvery(getType(newGame), newGameSaga);
}
