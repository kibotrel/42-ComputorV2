const parseLine = require('@srcs/parsing/input.js')
const infixToPosfix = require('@srcs/parsing/infix-to-postfix.js')
const evaluate = require('@srcs/maths/basic-operations.js')
const { parseImaginary } = require('@srcs/parsing/utils.js')
const { resolveVariable } = require('@env/variables.js')
const { isFunction } = require('@srcs/parsing/utils.js')
const { toNumeral } = require('@srcs/maths/utils.js')

const Numeral = require('@classes/numeral.js')
const Expression = require('@classes/expression.js')

const computeFunction = async (token) => {
  let functionName = token.substring(0, token.indexOf('('))
  const sign = functionName[0] === '-' ? -1 : 1

  if (functionName[0].match(/[+\-]/)) {
    functionName = functionName.substring(1)
  }

  const expression = await resolveVariable(functionName)
  const variables = token.substring(token.indexOf('(') + 1, token.indexOf(')')).split(',')
  const result = await Expression.evaluate(expression, variables)

  if (sign < 0) {
    return await Numeral.substract(0, result)
  } else {
    return result
  }
}

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
        return await computeFunction(token)
      } else {
        return new Numeral(toNumeral(parseFloat(token)))
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
      if (token.constructor.name !== 'String' || !token.match(/^[+\-*\/%^]$/)) {
        stack.push(token)
      } else {
        let secondOperand = stack.pop()
        let firstOperand = stack.pop()

        if (firstOperand.constructor.name === 'String') {
          if ((firstOperand.match(/^[+\-]?[a-z]+$/) || []).length > 0) {
            firstOperand = await resolveVariable(firstOperand)
          } else if (isFunction(firstOperand)) {
            firstOperand = await computeFunction(firstOperand)
          }
        }
        if (secondOperand.constructor.name === 'String') {
          if ((secondOperand.match(/^[+\-]?[a-z]+$/) || []).length > 0) {
            secondOperand = await resolveVariable(secondOperand)
          } else if (isFunction(secondOperand)) {
            secondOperand = await computeFunction(secondOperand)
          }
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

const numeralValue = async (inputLine) => {
  try {
    const infixNotation = await parseLine(inputLine)
    const postfixNotation = infixToPosfix(infixNotation)

    return await computePostfix(postfixNotation)
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { numeralValue, computePostfix }
 