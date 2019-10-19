import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    handleClick (i) {
        this.props.handleClick(i);
    }

    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.handleClick(i)}
        />;
    }

    render() {
        const winner = calculateWinner(this.props.squares);
        let status;
        if (winner) {
            status = 'Выиграл ' + winner;
        } else {
            status = 'Следующий ход: ' + (this.props.isXNext ? 'X' : 'O');
        }

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isXNext: true,
            history: [{
                squares: Array(9).fill(null)
            }]
        };
    }

    squares() {
        let history = this.state.history;
        return history[history.length - 1].squares;
    }

    handleClick(i) {
        let squares = this.squares().slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.isXNext ? 'X' : 'O';
        this.setState({
            isXNext: !this.state.isXNext,
            history: [...this.state.history, {squares, index: i, value: squares[i]}]
        });
    }

    jumpToStep(i) {
        let history = this.state.history;
        this.setState({
            history: history.slice(0, i + 1),
            isXNext: i % 2 === 0
        });
    }

    render() {
        let squares = this.squares();
        let steps = this.state.history.map((step, i) => {
            let phrase = i === 0 ? 'Заново' : `К шагу ${i}`;
            return <li key={step.value + step.index}>
                {phrase}
                <button onClick={() => this.jumpToStep(i)}>Return</button>
            </li>
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={squares}
                        isXNext={this.state.isXNext}
                        handleClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{steps}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}