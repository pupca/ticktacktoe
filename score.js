// Score board: rounds won by each player. Kept in memory only, like the board. A draw changes nothing.
function addWin(score, winner) {
  return winner ? { ...score, [winner]: score[winner] + 1 } : score;
}
