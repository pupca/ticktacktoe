// Tic-Tac-Toe: two players on one screen.
const boardEl = document.getElementById('board');
const cells = Array(9).fill(null);

const MARKS = {
  X: '<svg class="mark mark-x" viewBox="0 0 100 100"><line x1="18" y1="18" x2="82" y2="82"/><line x1="82" y1="18" x2="18" y2="82"/></svg>',
  O: '<svg class="mark mark-o" viewBox="0 0 100 100"><circle cx="50" cy="50" r="33"/></svg>',
};

function render() {
  boardEl.querySelectorAll('.cell').forEach((cell, i) => {
    cell.innerHTML = cells[i] ? MARKS[cells[i]] : '';
  });
}

function play(i) {
  if (cells[i]) return;
  cells[i] = 'X';
  render();
}

for (let i = 0; i < 9; i++) {
  const cell = document.createElement('button');
  cell.className = 'cell';
  cell.addEventListener('click', () => play(i));
  boardEl.appendChild(cell);
}
render();
