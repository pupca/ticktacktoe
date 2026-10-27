// Score board tests. Run with: npm test (Node 18+, no dependencies).
// game.js is loaded into a vm context with a minimal DOM stub.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function element(id) {
  return {
    id,
    textContent: '',
    innerHTML: '',
    className: '',
    disabled: false,
    children: [],
    handlers: {},
    classList: { toggle() {} },
    setAttribute() {},
    addEventListener(type, fn) { this.handlers[type] = fn; },
    appendChild(child) { this.children.push(child); },
    querySelectorAll() { return this.children; },
    click() { this.handlers.click(); },
  };
}

function loadGame() {
  const elements = {};
  const document = {
    getElementById(id) {
      if (!elements[id]) elements[id] = element(id);
      return elements[id];
    },
    createElement() { return element('cell'); },
  };
  const source = fs.readFileSync(path.join(__dirname, '..', 'game.js'), 'utf8');
  vm.runInNewContext(source, { document });
  return {
    cell: (i) => elements.board.children[i],
    play: (...squares) => squares.forEach((i) => elements.board.children[i].click()),
    restart: () => elements.restart.click(),
    score: () => `${elements['score-x'].textContent} : ${elements['score-o'].textContent}`,
  };
}

test('score starts at 0 : 0 on page load', () => {
  const game = loadGame();
  assert.equal(game.score(), '0 : 0');
});

test('X round win adds one to Player X', () => {
  const game = loadGame();
  game.play(0, 3, 1, 4, 2); // X takes the top row
  assert.equal(game.score(), '1 : 0');
});

test('O round win adds one to Player O', () => {
  const game = loadGame();
  game.play(1, 0, 2, 3, 4, 6); // O takes the left column
  assert.equal(game.score(), '0 : 1');
});

test('a draw changes nothing', () => {
  const game = loadGame();
  game.play(0, 1, 2, 4, 3, 5, 7, 6, 8); // full board, no line
  assert.equal(game.score(), '0 : 0');
  assert.equal(game.cell(0).disabled, true);
});

test('Restart round keeps the counts', () => {
  const game = loadGame();
  game.play(0, 3, 1, 4, 2); // X wins
  game.restart();
  assert.equal(game.score(), '1 : 0');
  game.play(1, 0, 2, 3, 4, 6); // O wins in the new round
  game.restart();
  assert.equal(game.score(), '1 : 1');
});

test('moves after a finished round do not add points', () => {
  const game = loadGame();
  game.play(0, 3, 1, 4, 2); // X wins
  game.play(5, 6, 7);
  assert.equal(game.score(), '1 : 0');
});
