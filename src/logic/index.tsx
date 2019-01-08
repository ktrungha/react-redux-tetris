import Piece, { Type as PieceTypes } from '../components/Piece';

const pieceTypes = ['i', 'j', 'l', 'o', 's', 't', 'z'];

export function genPieceType(): PieceTypes {
  const pieceType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
  return pieceType as PieceTypes;
}

export function merge(content: boolean[][], piece?: Piece) {
  if (!piece) {
    return content;
  }

  const mergedContent = content.map(row => row.slice());
  const pieceCells = piece.getCells();

  for (let i = 0; i < pieceCells.length; i += 1) {
    for (let j = 0; j < pieceCells[0].length; j += 1) {
      mergedContent[piece.y + i][piece.x + j] =
        pieceCells[i][j] || content[piece.y + i][piece.x + j];
    }
  }

  return mergedContent;
}
