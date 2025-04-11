/**
 * Calculate points
 *  - 4 letter words = 1 pt
 *  - 5 letter and biggers words are 1pt for each letter
 *  - If all 7 letters are used ("pangram"), +7pts
 *
 * @param  {[String]} array of words (or single word)
 * @return {Number} points
 */
export const calcPoints = (words) => words.reduce((totalPoints, word) => {
  let wordPoints = (word.length === 4) ? 1 : word.length;
  if (isPangram(word)) {
    wordPoints += 7;
  }
  return totalPoints += wordPoints;
}, 0);

export const isPangram = (word) => {
  return new Set(word.split('')).size === 7;
}
