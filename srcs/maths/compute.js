const parseLine = require('@srcs/parsing/input.js')
const infixToPosfix = require('@srcs/parsing/infix-to-postfix.js')
const evaluate = require('@srcs/maths/basic-operations.js')
const { parseImaginary } = require('@srcs/parsing/utils.js')

const Numeral = require('@classes/numeral')

const checkLastElement = async (token) => {
  try {
    if (token.constructor.name === 'Numeral') {
      return token
    } else if (token.constructor.name === 'String') {
      if ((token.match(/[a-z]/g) || []).length === 1 && (token.match(/i/g) || []).length === 1) {
        return parseImaginary(token)
      } else {
        return new Numeral({ r: parseFloat(token), i: 0 }) // TODO WHEN VARIABLE WILL BE ADDED
      }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const computePostfix = async (postfixNotation) => {
  const stack = []
  
  try {
    for (const token of postfixNotation) {
      if (!token.match(/^[+\-*\/%^]$/)) {
        stack.push(token)
      } else {
        const secondOperand = stack.pop()
        const firstOperand = stack.pop()

        const result = await evaluate({ firstOperand, operator: token, secondOperand })
        stack.push(result)
      }
    }

    return await checkLastElement(stack.pop())
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = async (inputLine) => {
  try {
    const infixNotation = await parseLine(inputLine)
    // console.log(infixNotation)
    const postfixNotation = infixToPosfix(infixNotation)
    // console.log(postfixNotation)
    return await computePostfix(postfixNotation)
  } catch (error) {
    return Promise.reject(error)
  }
}
