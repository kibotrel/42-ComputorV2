const { isValidBuiltin } = require('@env/utils.js')

const sanitizeOperand = async (operand) => {
  let trueOperand

  try {
    if (operand.constructor.name === 'String') {
      if (operand === 'i') {
        trueOperand = new Numeral({ r: 0, i: 1 })
      } else {
        trueOperand = parseFloat(operand)

        if (trueOperand === Number.NEGATIVE_INFINITY || trueOperand === Number.POSITIVE_INFINITY) {
          throw new ComputorError({ data: { operand }, code: 'tooBigNumber' })
        } else if (Number.isNaN(trueOperand)) {
          if (isValidBuiltin(operand)) {
            return await builtinHandler(operand)
          }
          throw new ComputorError({ data: { operand }, code: 'notNumber' })
        }
      }
    } else if (operand.constructor.name === 'Numeral' || operand.constructor.name === 'Matrix') {
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

    if (a === undefined) {
      throw new ComputorError({ data: { operand: firstOperand }, code: 'badOperand' })
    } else if (b === undefined) {
      throw new ComputorError({ data: { operand: secondOperand }, code: 'badOperand' })
    } else {
      return { a, b }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = async ({ firstOperand, operator, secondOperand }) => {
  try {
    const { a, b } = await checkOperands({ firstOperand, secondOperand })

    const operandTypes = [a.constructor.name, b.constructor.name]
    const constructor = operandTypes.includes('Matrix') ? Matrix : Numeral

    if (operator.match(/^[\/%^]$/) && constructor.name === 'Matrix') {
      throw new ComputorError({ code: 'unsupportedOperation' })
    } else if (operator.match(/^[+\-]$/) && operandTypes.filter(name => name === 'Matrix').length === 1) {
      throw new ComputorError({ code: 'unsupportedOperation' })
    }

    switch (operator) {
      case '+': return await constructor.add(a, b)
      case '-': return await constructor.substract(a, b)
      case '*': return await constructor.multiply(a, b)
      case '/': return await Numeral.divide(a, b)
      case '%': return await Numeral.modulus(a, b)
      case '^': return await Numeral.power(a, b)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
