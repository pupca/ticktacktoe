// Tic-Tac-Toe v1: two players on one screen. No backend, nothing is stored.
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const statusLabelEl = document.getElementById('status-label');
const restartEl = document.getElementById('restart');

let cells = Array(9).fill(null);
let player = 'X';
let over = false;

const MARKS = {
  X: '<svg class="mark mark-x" viewBox="0 0 100 100" aria-hidden="true"><line x1="18" y1="18" x2="82" y2="82"/><line x1="82" y1="18" x2="18" y2="82"/></svg>',
  O: '<svg class="mark mark-o" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="33"/></svg>',
};

function winner(board) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { player: board[a], line };
  }
  return null;
}

function render(win) {
  boardEl.querySelectorAll('.cell').forEach((cell, i) => {
    const mark = cells[i];
    cell.innerHTML = mark ? MARKS[mark] : '';
    cell.disabled = over || mark !== null;
    cell.classList.toggle('win', !!win && win.line.includes(i));
    cell.classList.toggle('o', !!win && win.player === 'O');
    cell.setAttribute('aria-label', `Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}: ${mark ?? 'empty'}`);
  });
}

function setStatus(label, text, kind) {
  statusLabelEl.textContent = label;
  statusEl.textContent = text;
  statusEl.className = `pill ${kind}`;
}

function play(i) {
  if (over || cells[i]) return;
  cells[i] = player;
  const win = winner(cells);
  if (win) {
    over = true;
    setStatus('Round over', `${win.player} wins!`, win.player.toLowerCase());
    restartEl.textContent = 'Play again';
    render(win);
    return;
  }
  if (cells.every(Boolean)) {
    over = true;
    setStatus('Round over', "It's a draw", 'draw');
    restartEl.textContent = 'Play again';
    render(null);
    return;
  }
  player = player === 'X' ? 'O' : 'X';
  setStatus('Next turn', `Player ${player}`, player.toLowerCase());
  render(null);
}

function restart() {
  cells = Array(9).fill(null);
  player = 'X';
  over = false;
  setStatus('Next turn', 'Player X', 'x');
  restartEl.textContent = 'Restart round';
  render(null);
}

for (let i = 0; i < 9; i++) {
  const cell = document.createElement('button');
  cell.className = 'cell';
  cell.type = 'button';
  cell.addEventListener('click', () => play(i));
  boardEl.appendChild(cell);
}
restartEl.addEventListener('click', restart);
restart();
