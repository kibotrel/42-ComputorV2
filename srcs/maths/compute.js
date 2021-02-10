const parseLine = require('@srcs/parsing/input.js')
const infixToPosfix = require('@srcs/parsing/infix-to-postfix.js')
const evaluate = require('@srcs/maths/basic-operations.js')

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

    return stack.pop()
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = async (inputLine) => {
  try {
    const infixNotation = await parseLine(inputLine)
    const postfixNotation = infixToPosfix(infixNotation)

    return await computePostfix(postfixNotation)
  } catch (error) {
    return Promise.reject(error)
  }
}
