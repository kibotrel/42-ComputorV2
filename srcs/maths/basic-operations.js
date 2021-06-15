const sanitizeOperand = async (operand) => {
  let trueOperand

  try {
    if (operand.constructor.name === 'String') {
      if (operand === 'i') {
        trueOperand = new Numeral({ r: 0, i: 1 })
      } else {
        trueOperand = parseFloat(operand)

        if (trueOperand === Number.NEGATIVE_INFINITY || trueOperand === Number.POSITIVE_INFINITY) {
          throw { data: operand, code: 'tooBigNumber' }
        } else if (Number.isNaN(trueOperand)) {
          throw { data: operand, code: 'notNumber' }
        }
      }
    } else if (operand.constructor.name === 'Numeral') {
      trueOperand = operand
    }

    return trueOperand
  } catch (error) {
    return Promise.reject(error)
  }
}

const checkOperands = async ({ firstOperand, secondOperand }) => {
  try {
    const a = await sanitizeOperand(firstOperand)
    const b = await sanitizeOperand(secondOperand)

    if (a === undefined || b === undefined ) {
      throw { data: {firstOperand, secondOperand, a, b }, code: 'badOperand' }
    } else
      return { a, b }
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = async ({ firstOperand, operator, secondOperand }) => {
  try {
    const { a, b } = await checkOperands({ firstOperand, secondOperand })

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
