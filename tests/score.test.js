// Run with: node --test tests/score.test.js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'score.js'), 'utf8'), context);

test('a round won by X adds one to X only', () => {
  const score = context.addWin({ X: 0, O: 0 }, 'X');
  assert.equal(score.X, 1);
  assert.equal(score.O, 0);
});

test('a round won by O adds one to O only', () => {
  const score = context.addWin({ X: 1, O: 0 }, 'O');
  assert.equal(score.X, 1);
  assert.equal(score.O, 1);
});

test('a draw (no winner) changes no count', () => {
  const score = context.addWin({ X: 1, O: 0 }, null);
  assert.equal(score.X, 1);
  assert.equal(score.O, 0);
});

test('wins accumulate over several rounds', () => {
  let score = { X: 0, O: 0 };
  for (const winner of ['X', null, 'X', 'O', null]) score = context.addWin(score, winner);
  assert.equal(score.X, 2);
  assert.equal(score.O, 1);
});

test('the given score is not changed', () => {
  const before = { X: 0, O: 0 };
  context.addWin(before, 'X');
  assert.equal(before.X, 0);
});
