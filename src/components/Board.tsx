import React from 'react';
import styled from 'styled-components';
import Piece from './Piece';
import { merge } from '../logic';

const Container = styled.table`
  border-collapse: collapse;
`;

const Cell = styled.td`
  border: 1px solid grey;
  width: 25px;
  height: 25px;
  padding: 0;
`;

interface BoardProps {
  piece?: Piece;
  content: boolean[][];
}

class Board extends React.PureComponent<BoardProps, {}> {
  constructor(props: BoardProps) {
    super(props);
  }

  render() {
    const { piece, content } = this.props;

    const mergedContent = merge(content, piece);

    return (
      <Container>
        <tbody>
          {mergedContent.reverse().map(row => {
            return (
              <tr>
                {row.map(cell => {
                  return (
                    <Cell>
                      {cell ? (
                        <div style={{ backgroundColor: 'pink', width: '100%', height: '100%' }} />
                      ) : null}
                    </Cell>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Container>
    );
  }
}

export default Board;
