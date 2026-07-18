# Reversi

A polished, browser-based implementation of the classic **Reversi (Othello)** strategy game. Built as a front-end project to demonstrate React state management, game-rule modelling, and responsive UI design.

**[Live Demo](https://reversi-sage.vercel.app/)**


## Highlights

- Play a complete two-player Reversi game on an 8 × 8 board
- Highlight legal moves for the active player
- Flip captured pieces in horizontal, vertical, and diagonal directions
- Automatically pass a turn when a player has no legal move
- Detect the end of the game and announce a winner or draw
- Live piece counts, turn indicators, restart control, and keyboard-accessible rule cards
- Responsive interface designed for desktop and mobile

## Tech stack

- **React 19** — component-based UI and game state
- **Vite** — local development and production build tooling
- **Bootstrap 5** — responsive layout utilities
- **CSS** — custom game board, pieces, motion, and accessible focus states

## Getting started

### Prerequisites

- Node.js 18 or later
- npm

### Run locally

```bash
git clone https://github.com/Dennylunch/Reversi.git
cd Reversi
npm install
npm run dev
```

### Available commands

```bash
npm run dev      # Start the Vite development server
npm run build    # Create an optimized production build
npm run lint     # Check code quality with ESLint
```

## How to play

1. Black moves first.
2. Choose a highlighted square that brackets one or more opponent pieces.
3. All bracketed pieces are flipped to your colour.
4. If you have no valid move, your turn is passed. The game ends when the board is full or neither player can move; the player with the most pieces wins.


## Author

**Lanzhi Zhang** — [@Dennylunch](https://github.com/Dennylunch)
