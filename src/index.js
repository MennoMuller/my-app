import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button
      className={props.highlight ? "square red" : "square"}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={
          this.props.winner &&
          (this.props.winner.highlight[0] == i ||
            this.props.winner.highlight[1] == i ||
            this.props.winner.highlight[2] == i)
        }
        key={i}
      />
    );
  }

  renderGrid(i) {
    let rows = [];
    for (let y = 0; y < i; y++) {
      rows.push(this.renderRow(i, y));
    }
    return <div>{rows}</div>;
  }

  renderRow(i, y) {
    let cols = [];
    for (let x = 0; x < i; x++) {
      cols.push(this.renderSquare(y * i + x));
    }
    return (
      <div
        className="board-row"
        key={y}
      >
        {cols}
      </div>
    );
  }

  render() {
    return this.renderGrid(3);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          col: 0,
          row: 0
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      ascending: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(
      0,
      this.state.stepNumber + 1
    );
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          col: (i % 3) + 1,
          row: Math.floor(i / 3) + 1
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  setAscending(value) {
    this.setState({
      ascending: value
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" +
          move +
          " (" +
          step.col +
          ", " +
          step.row +
          ")"
        : "Go to game start";
      if (move === this.state.stepNumber) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              <b>{desc}</b>
            </button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              {desc}
            </button>
          </li>
        );
      }
    });
    if (!this.state.ascending) {
      moves.reverse();
    }
    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
      console.log(winner.highlight);
    } else if (this.state.stepNumber == 9) {
      status = "It's a draw";
    } else {
      status =
        "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            onClick={() =>
              this.setAscending(!this.state.ascending)
            }
          >
            {"Sort " +
              (this.state.ascending
                ? "descending"
                : "ascending")}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], highlight: lines[i] };
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(<Game />);
