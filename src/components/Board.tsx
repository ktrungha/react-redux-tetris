import React from 'react';
import styled from 'styled-components';
import Piece from './Piece';
import { merge } from '../logic';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../constants';

const Container = styled.table`
  border-collapse: collapse;
`;
interface CellProps {
  collapse?: boolean;
}

const Cell = styled.td`
  width: 25px;
  height: 25px;
  padding: 0;
`;

const CollapsingCell = styled.td`
  width: 25px;
  height: 0;
  animation: collapse 250ms;
  padding: 0;
`;

interface BoardProps {
  piece?: Piece;
  content: string[][];
  scoringRows: number[];
}

class Board extends React.PureComponent<BoardProps, {}> {
  constructor(props: BoardProps) {
    super(props);
  }

  render() {
    const { piece, content, scoringRows } = this.props;

    const mergedContent = merge(content, piece);

    return (
      <div
        style={{
          position: 'relative',
          borderBottom: '1px solid grey',
          borderLeft: '1px solid grey',
        }}
      >
        <Container>
          <tbody>
            {content.map(row => (
              <tr>
                {row.map(() => (
                  <Cell>
                    <div
                      style={{
                        borderTop: '1px solid grey',
                        borderRight: '1px solid grey',
                        height: '100%',
                      }}
                    />
                  </Cell>
                ))}
              </tr>
            ))}
          </tbody>
        </Container>
        <Container style={{ position: 'absolute', bottom: 0, zIndex: -1 }}>
          <tbody>
            {mergedContent.reverse().map((row, reversedRowIndex) => {
              const originalIndex = BOARD_HEIGHT - 1 - reversedRowIndex;
              return (
                <tr>
                  {row.map(cell => {
                    return scoringRows.indexOf(originalIndex) >= 0 ? (
                      <CollapsingCell
                        style={{ backgroundColor: cell || undefined, borderColor: 'transparent' }}
                      />
                    ) : (
                      <Cell
                        style={{ backgroundColor: cell || undefined, borderColor: 'transparent' }}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Container>
      </div>
    );
  }
}

export default Board;
