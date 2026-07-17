import { useState } from 'react'
import './App.css'

function Square({ label, onSquareClick, available_move }) {
  return (
    <div className="col p-0">
      <div className="ratio ratio-1x1">
        <button
          type="button"
          className="board-cell position-absolute top-0 start-0 w-100 h-100 p-0"
          onClick={onSquareClick}
          aria-label={label === 'X' ? 'Black piece' : label === 'O' ? 'White piece' : 'Empty square'}>
          <span className={`${available_move ? "valid-move-dot" : ""}`} aria-hidden="false" />
          {label && (
            <span className={`game-piece ${label === 'X' ? 'piece-black' : 'piece-white'}`} />
          )}
        </button>
      </div>
    </div>
  )
}

function Board({square, onPlay, available_move }) {
  return (
    <div className="reversi-board" aria-label="8 by 8 Reversi board">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => (
        <div className="row g-0 flex-nowrap" key={row}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((col) => {
            const squareLabel = row * 8 + col
            return (
              <Square
                key={col}
                label={square[squareLabel]}
                onSquareClick={() => onPlay(squareLabel)}
                available_move={available_move.includes(squareLabel)}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

function GenerateIntialBoard() {
  const initial = Array(64).fill(null)
  initial[27] = 'X'
  initial[36] = 'X'
  initial[28] = 'O'
  initial[35] = 'O'

  return initial
}

export default function Play_game() {
  const [square, setSquare] = useState(GenerateIntialBoard())
  const [isXNext, setIsXNext] = useState(true)
  const [message, setMessage] = useState(0)
  const [pass, setPass] = useState(0)
  const [status, setStatus] = useState(1)
  const [activeRule, setActiveRule] = useState(2)
  let Xpieces = 0
  let Opieces = 0

  // Live piece counts
  const [real_t_Xpieces, setreal_t_Xpieces] = useState(2) 
  const [real_t_Opieces, setreal_t_Opieces] = useState(2) 


  function handleClick(i) {
    setPass(0)

    const squareCopy = square.slice()
    squareCopy[i] = isXNext ? 'X' : 'O'

    if (square[i] || Reversed_positions(square, squareCopy[i], i).length === 0) {
      return
    }

    const reverse = Reversed_positions(square, squareCopy[i], i)
    reverse.map((k) => {
      squareCopy[k] = squareCopy[i]
    })

    setSquare(squareCopy)

    // pass
    if (Available_moves(squareCopy, !isXNext).length === 0) {
      setPass(1)
    } else {
      setIsXNext(!isXNext)
    }


    // determine the real-time num of pieces 
    calTheNumOfPieces(setreal_t_Xpieces, setreal_t_Opieces, squareCopy)

    // find the winner
    if (!squareCopy.includes(null) || (Available_moves(squareCopy, isXNext).length === 0 && Available_moves(squareCopy, !isXNext).length === 0 )) {
      setPass(0)
      setStatus(0)
      // in js, empty array is truthy
      squareCopy.map((piece) => {
        if (piece === 'X') {
          Xpieces += 1
        }
        
        if (piece === 'O') {
          Opieces += 1
        }
      })

      if (Xpieces > Opieces) {
        setMessage(1) // X is the winner
      } else if (Opieces > Xpieces) {
        setMessage(2) // O is the winner
      } else {
        setMessage(3) // It's a draw
      }
    }
  }

  function handleRuleKeyDown(event, ruleNumber) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setActiveRule(ruleNumber)
    }
  }

  return (
    <main className="game-page min-vh-100">
      <nav className="navbar navbar-expand-lg game-navbar py-3">
        <div className="container-xl px-4">
          <a className="navbar-brand d-flex align-items-center gap-3 m-0" href="#game-area">
            <span className="brand-symbol" aria-hidden="true">
              <i className="brand-disc brand-disc-black" />
              <i className="brand-disc brand-disc-white" />
            </span>
            <span className="brand-text">REVERSI</span>
          </a>

          <div className="d-flex align-items-center gap-3">
            <a className="rules-link d-none d-sm-inline-block" href="#rules">Rules</a>
            <button onClick={() => restart(setSquare, setIsXNext, setStatus, setreal_t_Xpieces, setreal_t_Opieces, setMessage, setPass)} type="button" className="btn restart-button px-4 py-2">Restart</button>
          </div>
        </div>
      </nav>

      <section id="game-area" className="container-xl px-4 py-3 py-lg-4">
        <div className="row align-items-start g-4 g-xl-5">
          <div className="game-sidebar col-12 col-lg-4">
            <h1 className="display-title mb-3">
              Turn the tide<br />
              <span>claim the board</span>
            </h1>

            <p className="game-intro mb-4">
              Surround your opponent's pieces to flip them. Choose each move carefully, control the board, and win the game.
            </p>

            <div className="status-card card border-0 mb-3">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between gap-3">
                  <span className="status-label">GAME STATUS</span>
                  <span className="status-pill d-inline-flex align-items-center gap-2">
                    <i />{status ? "IN PROGRESS" : "GAME OVER"}
                  </span>
                </div>

                <hr className="status-divider my-3" />

                <div className="d-flex align-items-center justify-content-between gap-3">
                  <span className="turn-label">CURRENT TURN</span>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`mini-piece mini-piece-${isXNext ? 'black' : 'white'}`}/>
                    <strong className="turn-value">Player {isXNext ? '1' : '2'}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="players-panel d-grid gap-2">
              <div className={`player-row ${isXNext ? "active-player" : ""} d-flex align-items-center justify-content-between`}>
                <div className="d-flex align-items-center gap-3">
                  <span className="player-piece player-piece-black" />
                  <div>
                    <strong className="d-block">Player 1</strong>
                    <span>Black</span>
                  </div>
                </div>
                <strong className="player-score">{real_t_Xpieces}</strong>
              </div>

              <div className={`player-row ${!isXNext ? "active-player" : ""} d-flex align-items-center justify-content-between`}>
                <div className="d-flex align-items-center gap-3">
                  <span className="player-piece player-piece-white" />
                  <div>
                    <strong className="d-block">Player 2</strong>
                    <span>White</span>
                  </div>
                </div>
                <strong className="player-score">{real_t_Opieces}</strong>
              </div>




            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="board-heading mx-auto d-flex justify-content-between align-items-end mb-3 px-1">
              <div>
                <strong>{isXNext ? 'Black' : 'White'} to move</strong>
              </div>
              <span>8 × 8 BOARD</span>
            </div>



          {/* Pass */}  
            <div className="pass-message-slot">
            {(pass === 1) && (
              <div className="pass-turn-message mx-auto mb-3" role="status">
              Player {!isXNext ? '1' : '2'} has no legal moves. The turn passes to their opponent.
              </div>
            )}
            </div>
          {/* Pass */} 



          {/* The board */}
            <div className="board-frame mx-auto">
              <Board square={square} onPlay={handleClick} available_move={Available_moves(square, isXNext)}/>
            </div>
          {/* The board */}



            {/* The game message */}
              {(message===1 || message===2) && (    
                <div className="winner-banner mx-auto mt-3 d-flex align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <span className={`winner-piece-${message === 1 ? 'black' : 'white'}`} aria-hidden="true" />
                    <div>
                      <span className="winner-label d-block">WINNER</span>
                      <strong className="winner-name d-block">Player {message} · {message === 1 ? 'Black' : 'White'} wins</strong>
                    </div>
                  </div>
                  <span className="winner-badge">WINNER</span>
                </div>
              )}

              {/*  if (message===3) then (<div>...</div>)   */}
              {(message===3) && (
                <div className="winner-banner mx-auto mt-3 d-flex align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center flex-shrink-0" aria-hidden="true">
                      <span className="winner-piece-black" />
                      <span className="winner-piece-white" style={{ marginLeft: '-12px' }} />
                    </div>
                    <div>
                      <span className="winner-label d-block">GAME RESULT</span>
                      <strong className="winner-name d-block">Draw · Both players have {real_t_Xpieces} pieces</strong>
                    </div>
                  </div>
                  <span className="winner-badge">DRAW</span>
                </div>
              )}

            {/* The game message */}



            <div className="board-note d-flex align-items-center justify-content-between mt-3 px-1">
              <span>Select a highlighted square to play</span>
              <span>Moves cannot be undone</span>
            </div>            

            
          </div>
        </div>
      </section>

      <section id="rules" className="rules-section py-5 py-lg-6">
        <div className="container-xl px-4">
          <div className="row align-items-end mb-4 g-3">
            <div className="col">
              <span className="rules-kicker d-block mb-2">QUICK START</span>
              <h2 className="rules-title mb-0">Learn Reversi in 4 steps</h2>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-sm-6 col-lg-3">
              <article
                className={`rule-card ${activeRule === 1 ? 'featured-rule' : ''} card h-100 border-0`}
                role="button"
                tabIndex={0}
                aria-pressed={activeRule === 1}
                onClick={() => setActiveRule(1)}
                onKeyDown={(event) => handleRuleKeyDown(event, 1)}>
                <div className="card-body p-4">
                  <span className="rule-number">01</span>
                  <div className="rule-icon my-4" aria-hidden="true">
                    <span className="rule-piece rule-piece-black" />
                    <span className="rule-arrow">→</span>
                    <span className="rule-piece rule-piece-white" />
                  </div>
                  <h3>Take turns</h3>
                  <p className="mb-0">Black moves first. Take turns placing one piece on an empty square.</p>
                </div>
              </article>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <article
                className={`rule-card ${activeRule === 2 ? 'featured-rule' : ''} card h-100 border-0`}
                role="button"
                tabIndex={0}
                aria-pressed={activeRule === 2}
                onClick={() => setActiveRule(2)}
                onKeyDown={(event) => handleRuleKeyDown(event, 2)}>
                <div className="card-body p-4">
                  <span className="rule-number">02</span>
                  <div className="rule-icon my-4" aria-hidden="true">
                    <span className="rule-piece rule-piece-black" />
                    <span className="rule-piece rule-piece-white raised-piece" />
                    <span className="rule-piece rule-piece-black" />
                  </div>
                  <h3>Surround and flip</h3>
                  <p className="mb-0">Trap your opponent's pieces in a row, column, or diagonal to flip them.</p>
                </div>
              </article>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <article
                className={`rule-card ${activeRule === 3 ? 'featured-rule' : ''} card h-100 border-0`}
                role="button"
                tabIndex={0}
                aria-pressed={activeRule === 3}
                onClick={() => setActiveRule(3)}
                onKeyDown={(event) => handleRuleKeyDown(event, 3)}>
                <div className="card-body p-4">
                  <span className="rule-number">03</span>
                  <div className="rule-icon my-4" aria-hidden="true">
                    <span className="rule-pass">PASS</span>
                    <span className="rule-arrow">→</span>
                    <span className="rule-piece rule-piece-black" />
                  </div>
                  <h3>Skip when blocked</h3>
                  <p className="mb-0">If a player has no legal move, their turn is skipped and their opponent plays again.</p>
                </div>
              </article>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <article
                className={`rule-card ${activeRule === 4 ? 'featured-rule' : ''} card h-100 border-0`}
                role="button"
                tabIndex={0}
                aria-pressed={activeRule === 4}
                onClick={() => setActiveRule(4)}
                onKeyDown={(event) => handleRuleKeyDown(event, 4)}>
                <div className="card-body p-4">
                  <span className="rule-number">04</span>
                  <div className="rule-score my-4" aria-hidden="true">
                    <span>32</span><i>:</i><strong>34</strong>
                  </div>
                  <h3>Finish and score</h3>
                  <p className="mb-0">The game ends when the board is full or neither player can move. Most pieces wins.</p>
                </div>
              </article>
            </div>
          </div>

          <div className="rules-tip d-flex align-items-center gap-3 mt-4 px-4 py-3">
            <span>TIP</span>
            <p className="mb-0">Corner pieces can never be flipped. Controlling the four corners is key to the game.</p>
          </div>
        </div>
      </section>

      <footer className="game-footer py-4">
        <div className="container-xl px-4 d-flex flex-column flex-sm-row justify-content-between gap-2">
          <span>© 2026 Lanzhi Zhang · Reversi</span>
          <span>Think ahead. Turn the tide.</span>
        </div>
      </footer>
    </main>
  )
}







function Intermediate_locations(position, newPosition) {
  const pos_row = Math.trunc(position / 8)
  const pos_col = position % 8
  const newPos_row = Math.trunc(newPosition / 8)
  const newPos_col = newPosition % 8
  let location = []

  if (pos_row === newPos_row) {
    let startCol = Math.min(pos_col, newPos_col) + 1
    while (startCol < Math.max(pos_col, newPos_col)) {
      location.push([pos_row, startCol])
      startCol += 1
    }
  } else if (pos_col === newPos_col) {
    let startRow = Math.min(pos_row, newPos_row) + 1
    while (startRow < Math.max(pos_row, newPos_row)) {
      location.push([startRow, pos_col])
      startRow += 1
    }
  } else if (Math.abs(pos_row - newPos_row) === Math.abs(pos_col - newPos_col)) {
    let row_value = pos_row
    let column_value = pos_col
    let list_of_row = []
    let list_of_column = []
    const vertical_distance = newPos_row - pos_row
    const horizontal_distance = newPos_col - pos_col
    const col_parity = Math.floor(vertical_distance / Math.abs(vertical_distance))
    const row_parity = Math.floor(horizontal_distance / Math.abs(horizontal_distance))

    while (row_value * col_parity < (newPos_row - col_parity) * col_parity) {
      if (vertical_distance > 0) {
        row_value += 1
        list_of_row.push(row_value)
      } else {
        row_value -= 1
        list_of_row.push(row_value)
      }
    }

    while (column_value * row_parity < (newPos_col - row_parity) * row_parity) {
      if (horizontal_distance > 0) {
        column_value += 1
        list_of_column.push(column_value)
      } else {
        column_value -= 1
        list_of_column.push(column_value)
      }
    }

    let timesAdded = 0
    while (timesAdded < list_of_row.length) {
      location.push([list_of_row[timesAdded], list_of_column[timesAdded]])
      timesAdded += 1
    }
  }

  let interLocation = []
  location.map((coordinates) => {
    interLocation.push(coordinates[0] * 8 + coordinates[1])
  })

  return interLocation
}




function Reversed_positions(board, piece, position) {
  let reversedPos = []
  let samePieces = []

  board.map((space, index) => {
    if (space === piece) {
      samePieces.push(index)
    }
  })

  samePieces.map((piecePos) => {
    let possiblePos = Intermediate_locations(piecePos, position)
    if (possiblePos.length !== 0) {
      let checking = []
      possiblePos.map((check) => {
        if (![piece, null].includes(board[check])) {
          checking.push(check)
        }
      })

      if (possiblePos.length === checking.length) {
        possiblePos.map((reversedPiece) => {
          reversedPos.push(reversedPiece)
        })
      }
    }
  })

  return reversedPos
}



function calTheNumOfPieces(setX, setO, neededsquare) {
    let x=0, o=0
    neededsquare.map(piece => {
        if (piece === 'X') {
          x += 1
        } else if (piece === 'O') {
          o += 1
        }
      })
    
    setX(x)
    setO(o)
  }



function Available_moves(neededsquare, player) {
    let empty_position = []
    let player_piece = []
    let available_move = []
    let final = []
    player = player ? 'X' : 'O'

    neededsquare.map((piece, index) => {
      if (piece === null) {
        empty_position.push(index)} 
      if (piece === player) {
        player_piece.push(index)}
    })

    // Identify all the empty positions that can reverse the
    // opponent's pieces, and converts the piece's indexes into a moves.
    empty_position.map(empty => {
      if (Reversed_positions(neededsquare, player, empty).length > 0) {
        available_move.push(empty)
      }})

    // Removes all duplicate indexes of pieces.
    available_move.map(check => {
      if (!final.includes(check)) {
        final.push(check)
      }})
    
    return final
  }



  function restart(setSquare, setIsXNext, setStatus, setreal_t_Xpieces, setreal_t_Opieces, setMessage, setPass) {
    setSquare(GenerateIntialBoard())
    setIsXNext(true)
    setStatus(1)
    setreal_t_Xpieces(2)
    setreal_t_Opieces(2)
    setMessage(0)
    setPass(0)
  }




{/* npm run dev */}
