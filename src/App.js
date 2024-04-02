import { useState } from "react";

// 1.仅针对当前着手，显示“You are at move #…”而不是按钮。
// 2.重写 Board 以使用两个循环来制作方块而不是对它们进行硬编码。
// 3.添加一个切换按钮，使可以按升序或降序对落子的步数进行排序。
// 4.当有人获胜时，突出显示致使获胜的三个方块（当没有人获胜时，显示一条关于结果为平局的消息）。
// 5.在“落子”的历史列表中以 (row, col) 格式显示每步的位置。

export default function Game() {
  const [currentMove, setCurrentMove] = useState(0);
  const xisNext = currentMove % 2 === 0;
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[currentMove];

  function handlePlay(newSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), newSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((square, move) => {
    let description
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {
          move === currentMove ?
            <strong>{`You are at move #${currentMove}`}</strong>
            : (<button onClick={() => jumpTo(move)}>{description}</button>
            )
        }
      </li>
    )
  })
  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} xisNext={xisNext} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function Board({ squares, xisNext, onPlay }) {
  const winner = calculateWinner(squares);
  const status = winner ? `Winner: ${winner}` : `Next player: ${xisNext ? "X" : "O"}`;

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return
    const newSquares = squares.slice();
    xisNext ? newSquares[i] = "X" : newSquares[i] = "O";
    onPlay(newSquares);
  }

  return <>
    <div className="status">{status}</div>

    <div className="board-row">
      <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
      <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
      <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
    </div>
    <div className="board-row">
      <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
      <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
      <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
    </div>
    <div className="board-row">
      <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
      <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
      <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
    </div>
  </>;
}

// 计算获胜者
function calculateWinner(squares) {
  // 胜利的所有可能情况
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // 返回获胜者
      return squares[a]
    }
  }
  return null
}