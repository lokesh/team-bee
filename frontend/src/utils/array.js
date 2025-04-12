/**
 * input: '{v,r,t}''
 * output: ['v','r','t']
 * @param  {String} str
 * @return {[String]}
 */
export const parseCharArray = (str) => str.replace(/[{}]/g, "").split(',')

/**
 * input ['kiwi', 'melon']
 * output "{kiwi,melon}"
 * @param  {[String]} arr
 * @return {String}
 */
export const prepStrArray = (arr) => `{${arr.join()}}`

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array
 * @return {Array}
 */
export const shuffleArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
} 