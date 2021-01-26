const operators = require('@configs/operators.json')

const isValid = (expression) => {

  // Check, if present in the expression, if the appearance
  // order of brackets is correct, track the amount and
  // look if operator and numbers are in the right place.

  const stack = []
  let bracketCount = 0
  let operatorCount = 0
  let numberSize = 0
  let powerFlag = false
  let numberFlag = false
  let operatorFlag = false
  let decimalFlag = false

  for (let i = 0; i < expression.length; i++) {

    // Bracket checks

    if (expression[i] === '(') {
      if (i !== 0) {
        if (expression[i - 1].match(/\d/)) {
          expression = `${expression.slice(0, i)}*${expression.slice(i)}`
          operatorCount++
          i++
        } else if (expression[i - 1] === '.') {
          return { infixNotation: expression, error: 'ISVALID_REAL_LBRACKET', errorIndex: i }
        }
      }
      stack.push(1)
      bracketCount++
      numberFlag = false
      decimalFlag = false
      operatorFlag = false
    } else if (expression[i] === ')') {
      if (stack.pop() === undefined || operatorFlag || (i !== 0 && decimalFlag && expression[i - 1] === '.')) {
        return { infixNotation: expression, error: 'ISVALID_REAL_RBRACKET', errorIndex: i }
      } else {
        bracketCount++
      }
    }

    // Operator checks

    if (expression[i].match(/[+\-*\/%^]/)) {
      powerFlag = false
      if (operatorFlag || expression[i].match(/[*\/%^]/) && (i === 0 || operatorFlag || !numberFlag || (decimalFlag && !expression[i - 1].match(/\d/)))) {
        return { infixNotation: expression, error: 'ISVALID_REAL_OPERATOR', errorIndex: i }
      } else {
        numberFlag = false
        decimalFlag = false
      }

      if (expression[i] === '^') {
        powerFlag = true
      }

      operatorCount++
      operatorFlag = true
    }

    // Number checks

    if (expression[i].match(/\d/)) {
      operatorFlag = false
      numberFlag = true
      numberSize++
    }
    if (expression[i] === '.') {
      if (!numberFlag || decimalFlag) {
        return { infixNotation: expression, error: 'ISVALID_REAL_FLOAT', errorIndex: i }
      } else {
        decimalFlag = true
        numberSize++
      }
    }
  }

  // Stack with open and not yet closed brackets at the
  // end of expression parsing means invalid expression

  if (stack.length > 0) {
    return { error: 'ISVALID_REAL_BRACKETS' }
  }

  // Check that the size of the numbers, the amont of
  // operators and brackets match the size of the initial
  // string expression.

  if (operatorCount + bracketCount + numberSize === expression.length) {
    return { infixNotation: expression, error: null }
  } else {
    return { error: 'ISVALID_REAL_EXPRSIZE'}
  }
}

module.exports = (expression) => {
  const { infixNotation, error } = isValid(expression)

  if (error) {
    return `Error: Expression is not well formated. (${error})`
  } else {
    return infixNotation // computeReal(suffixNotation(infixNotation))
  }
}