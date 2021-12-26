const { trueValue } = require('./maths.js')

const numeralEquality = (a, b) => {
  return trueValue(a.r) === trueValue(b.r) && trueValue(a.i) === trueValue(b.i)
}

const matrixEquality = (a, b) => {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[i].length; j++) {
      if (!numeralEquality(a[i][j], b[i][j])) {
        return false
      }
    }
  }
  return true
}
module.exports = { numeralEquality, matrixEquality }