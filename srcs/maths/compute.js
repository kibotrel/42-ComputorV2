const parseLine = require('@srcs/parsing/input.js')
const infixToPosfix = require('@srcs/parsing/infix-to-postfix.js')

const Evaluate = {
  '+': (a, b) => { return parseFloat(a) + parseFloat(b) },
  '-': (a, b) => { return parseFloat(a) - parseFloat(b) },
  '*': (a, b) => { return parseFloat(a) * parseFloat(b) },
  '/': (a, b) => { return parseFloat(a) / parseFloat(b) },
  '%': (a, b) => { return parseFloat(a) % parseFloat(b) },
  '^': (a, b) => { return Math.pow(parseFloat(a), parseFloat(b)) }
}

const computePostfix = (postfixNotation) => {
  const stack = []

  for (const token of postfixNotation) {
    if (!token.match(/^[+\-*\/%^]$/)) {
      stack.push(token)
    } else {
      const secondOperand = stack.pop()
      const firstOperand = stack.pop()
      const result = Evaluate[token](firstOperand, secondOperand)

      stack.push(result)
    }
  }

  return parseFloat(stack.pop())
}

module.exports = async (inputLine) => {
  try {
    const infixNotation = await parseLine(inputLine)
    const postfixNotation = infixToPosfix(infixNotation)

    return computePostfix(postfixNotation)
  } catch (error) {
    return Promise.reject(error)
  }
}
