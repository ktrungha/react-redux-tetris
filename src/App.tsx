import React, { Component } from 'react';
import './App.css';
import Board from './components/Board';
import { throttle } from 'lodash';
import { newGame, State, movePiece, rotate } from './reducer';
import { connect } from 'react-redux';

const emptyContentSmall: string[][] = [];
for (let i = 0; i < 2; i += 1) {
  const row: string[] = [];
  for (let j = 0; j < 4; j += 1) {
    row.push('');
  }

  emptyContentSmall.push(row);
}

function mapStateToProps(state: State) {
  return {
    content: state.content,
    piece: state.piece,
    nextPiece: state.nextPiece,
    score: state.score,
  };
}

const mapDispatchToProps = { newGame, movePiece, rotate };

type DispatchProps = typeof mapDispatchToProps;

interface AppProps extends ReturnType<typeof mapStateToProps>, DispatchProps {}

class App extends Component<AppProps, {}> {
  constructor(props: AppProps) {
    super(props);

    this.keyDown = throttle(this.keyDown.bind(this), 50);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDown);
  }

  keyDown(ev: KeyboardEvent) {
    if (ev.keyCode === 37) {
      this.props.movePiece(-1, 0);
    } else if (ev.keyCode === 39) {
      this.props.movePiece(1, 0);
    } else if (ev.keyCode === 40) {
      this.props.movePiece(0, -1);
    } else if (ev.keyCode === 38) {
      this.props.rotate();
    }
  }

  render() {
    const { content, piece, nextPiece, score } = this.props;
    return (
      <div className="App">
        <Board piece={piece} content={content} />
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ margin: '25px' }}>Score: {score}</div>
          <div>
            <div style={{ margin: '15px', textAlign: 'center' }}>Next Piece:</div>
            <Board piece={nextPiece} content={emptyContentSmall} />
          </div>
          <div style={{ margin: '25px' }}>
            <button onClick={this.props.newGame}>New Game</button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
