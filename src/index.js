import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Stage, Layer, Rect, Text } from 'react-konva';


class ColoredRect extends React.Component {
    state = {
      color: 'green',
      cellSize: 34
    };
    render() {
      return (
        <Layer>
            <Rect
                x={this.props.x}
                y={this.props.y}
                width={this.state.cellSize}
                height={this.state.cellSize}
                fill={this.state.color}
                onClick={() => this.props.onClick()}
            />
            <Text
                fontSize={30}
                x={this.props.x+5}
                y={this.props.y+5}
                width={this.state.cellSize}
                height={this.state.cellSize}
                text={this.props.value}
                onClick={() => this.props.onClick()}
            />
        </Layer>
      );
    }
}
  
class Board extends React.Component {
    render() {
        let x,y,cell_iter=0;
        let board = [];
        for(let column=0;column<=2;column++){
            y=5+35*column;
            for(let row=0;row<=2;row++){
                board.push([y,x=5+35*row,cell_iter])
                cell_iter++
            }
        }
        const field = board.map((cell) => {
            return (
                <ColoredRect
                    x={cell[1]}
                    y={cell[0]}
                    key={cell[2]}
                    value={this.props.board[cell[2]]}
                    onClick={() => this.props.onClick(cell[2])}
                />
            );
        })
      return (
        <div>
            <Stage width={150} height={150}>
                    {field}
            </Stage>    
        </div>
      );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: Array(9).fill(null),
            stepNumber: 0,
            xIsNext: true,
            scores:Array(2).fill(0),

        };
    }



    getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    }
    Computer = (board) => {
        let mapping = []

        for (let i = 0; i < board.length; i++)
            if (!board[i]) mapping.push(i);
        if(mapping)
        board[mapping[this.getRandomInt(mapping.length)]] = 'O';
    }

    handleClick(i) {
        let board = this.state.board.slice();
        if(this.state.winner)
            board = Array(9).fill(null);
        if(board[i])
            return;
        let xIsNext = this.state.xIsNext;
        const scores = this.state.scores.slice();
        board[i] = 'X';
        let winner = calculateWinner(board);
        if(!winner){
            this.Computer(board);
            winner = calculateWinner(board);
        }
        if (winner) {
            winner === 'X'? 
                (scores[0]++) : 
                (scores[1]++);
            xIsNext = true;
        }
        
        
        this.setState({
            board: board,
            stepNumber: 0,
            xIsNext: xIsNext,
            log:this.state.log,
            nick: this.state.nick,
            winner: winner,
            scores: scores,
        });
    }
    
    handleKeyPress(event) {
        if(event.key === 'Enter'){
          this.setState({nick: event.target.value});
        }
    }

    render() {
        let status;
        if (this.state.winner) {
            status = 'Выиграл ' + (
                this.state.winner === 'X'? 
                    (this.state.nick) : 
                    ('Computer'));
        } else {
            status = 'Следующий ход: ' + (this.state.xIsNext ? this.state.nick : 'Computer');
        }

        

        if(this.state.nick === undefined){
            return(
                <input 
                    type="text"
                    placeholder="Введите никнейм"
                    onKeyPress={(event) => this.handleKeyPress(event)}
                />
            )
        }else{
            return (
            <div className="game">
                <div className="game-board">
                    <Board
                        board={this.state.board}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{this.state.nick} {this.state.scores[0]} VS {this.state.scores[1]} Computer</div>
                </div>
            </div>
            );
        }
    }
}

function calculateWinner(board) {
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
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
