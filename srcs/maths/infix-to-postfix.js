const evaluate = require('@srcs/maths/basic-operations.js')
const { parseImaginary } = require('@srcs/parsing/utils.js')
const { resolveVariable } = require('@env/variables.js')
const { isFunction } = require('@srcs/parsing/utils.js')

const checkLastElement = async (token) => {
  try {
    if (token.constructor.name === 'Numeral') {
      return token
    } else if (token.constructor.name === 'String') {
      if ((token.match(/[a-z]/g) || []).length === 1 && (token.match(/i/g) || []).length === 1) {
        return parseImaginary(token)
      } else if ((token.match(/^[+\-]?[a-z]+$/) || []).length > 0) {
        return await resolveVariable(token)
      } else if (isFunction(token)) {
        const functionName = token.substring(0, token.indexOf('('))
        const expression = await resolveVariable(functionName)
        const variables = token.substring(token.indexOf('(') + 1, token.indexOf(')')).split(',')

        return await Expression.evaluate(expression, variables)
      } else {
        // return await toNumeral(parseFloat(token))
        return new Numeral({ r: parseFloat(token), i: 0 }) // TODO WHEN VARIABLE WILL BE ADDED
      }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = async (postfixNotation) => {
  const stack = []

  try {
    for (const token of postfixNotation) {
      if (token.constructor.name !== 'String' || !token.match(/^[+\-*\/%^]$/)) {
        stack.push(token)
      } else {
        let secondOperand = stack.pop()
        let firstOperand = stack.pop()

        if (firstOperand.constructor.name === 'String' && (firstOperand.match(/^[+\-]?[a-z]+$/) || []).length > 0) {
          firstOperand = await resolveVariable(firstOperand)
        }
        if (secondOperand.constructor.name === 'String' && (secondOperand.match(/^[+\-]?[a-z]+$/) || []).length > 0) {
          secondOperand = await resolveVariable(secondOperand)
        }

        const result = await evaluate({ firstOperand, operator: token, secondOperand })
        stack.push(result)
      }
    }

    return await checkLastElement(stack.pop())
  } catch (error) {
    return Promise.reject(error)
  }
}