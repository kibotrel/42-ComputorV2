const Numeral = require('@classes/numeral.js')

const sanitizeOperands = async ({ firstOperand, secondOperand }) => {
  let a, b

  try {
    if (firstOperand.constructor.name !== 'Numeral' && firstOperand !== 'i') {
      a = parseFloat(firstOperand)

      if (a === Number.NEGATIVE_INFINITY || a === Number.POSITIVE_INFINITY ) {
        throw { data: firstOperand, code: 'tooBigNumber' }
      } else if (Number.isNaN(a)) {
        throw { data: firstOperand, code: 'notNumber' }
      }
    }

    if (secondOperand.constructor.name !== 'Numeral' && secondOperand !== 'i') {
      b = parseFloat(secondOperand)

      if (b === Number.NEGATIVE_INFINITY || b === Number.POSITIVE_INFINITY ) {
        throw { data: secondOperand, code: 'tooBigNumber' }
      } else if (Number.isNaN(b)) {
        throw { data: secondOperand, code: 'notNumber' }
      }
    }

    return { a: a === undefined ? firstOperand : a, b: b === undefined ? secondOperand : b }
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = async ({ firstOperand, operator, secondOperand }) => {
  try {
    const { a, b } = await sanitizeOperands({ firstOperand, secondOperand })

    switch (operator) {
      case '+': return await Numeral.add(a, b)
      case '-': return await Numeral.substract(a, b)
      case '*': return await Numeral.multiply(a, b)
      case '/': return await Numeral.divide(a, b)
      case '%': return await Numeral.modulus(a, b)
      case '^': return await Numeral.power(a, b)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
