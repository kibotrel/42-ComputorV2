const { isVariableRegistered, sanitizeName, isValidBuiltin } = require('@env/utils.js')

const infixToPosfix = require('@srcs/parsing/infix-to-postfix.js')
const parseLine = require('@srcs/parsing/input.js')
const { parseImaginary, isFunction, isComposite } = require('@srcs/parsing/utils.js')

const evaluate = require('@srcs/maths/basic-operations.js')
const { toNumeral } = require('@srcs/maths/utils.js')

const computeVariable = async (token, type) => {
  try {
    const variableName = sanitizeName(token)
    const sign = (token[0] === '-' ? -1 : 1)

    if (variableName === 'i') {
      return new Numeral({ r: 0, i: (sign < 0 ? -1 : 1) })
    }

    const variable = isVariableRegistered(variableName)

    if (!variable) {
      if (isValidBuiltin(token)) {
        return token
      } else {
        throw new ComputorError({ data: { name: variableName }, code: `unknown${type}` })
      }
    }

    if (variable.constructor.name === 'Numeral') {
      return (sign < 0 ? Numeral.opposite(variable) : variable)
    } else if (variable.constructor.name === 'Expression') {
      const fun = variable
      const arguments = token.substring(token.indexOf('(') + 1, token.lastIndexOf(')')).split(',')
      const argumentList = []

      for (const argument of arguments) {
        const value = await numeralValue(argument)
    
        argumentList.push(value)
      }

      const value = await Expression.evaluate(fun, argumentList)

      return (sign < 0 ? Numeral.opposite(value) : value)
    } else if (variable.constructor.name === 'Matrix') {
      return (sign < 0 ? Matrix.opposite(variable) : variable)
    } else {
      throw new ComputorError({ data: { name: variableName }, code: `unknown${type}` })
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const checkLastElement = async (token) => {
  try {
    if (token.constructor.name === 'Numeral' || token.constructor.name === 'Matrix') {
      return token
    } else if (token.constructor.name === 'String') {
      if ((token.match(/[a-z]/g) || []).length === 1 && (token.match(/i/g) || []).length === 1) {
        return parseImaginary(token)
      } else if ((token.match(/^[+\-]?[a-z]+$/) || []).length > 0) {
        return await computeVariable(token, 'Variable')
      } else if (isValidBuiltin(token)) {
        return await builtinHandler(token)
      } else if (isFunction(token) || isComposite(token)) {
        return await computeVariable(token, 'Function')
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
            firstOperand = await computeVariable(firstOperand, 'Variable')
          } else if (isFunction(firstOperand) || isComposite(firstOperand)) {
            firstOperand = await computeVariable(firstOperand, 'Function' )
          }
        }

        if (secondOperand.constructor.name === 'String') {
          if ((secondOperand.match(/^[+\-]?[a-z]+$/) || []).length > 0) {
            secondOperand = await computeVariable(secondOperand, 'Variable')
          } else if (isFunction(secondOperand) || isComposite(secondOperand)) {
            secondOperand = await computeVariable(secondOperand, 'Function')
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

    if (!infixNotation.length) {
      throw new ComputorError({ data: { string: inputLine }, code: 'badInputFormat' })
    }
    const postfixNotation = infixToPosfix(infixNotation)

    return await computePostfix(postfixNotation)
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { numeralValue, computePostfix }
 