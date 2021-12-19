const { isVariableRegistered, isValidBuiltin, sanitizeName } = require('@env/utils.js')

const computePostfix = require('@srcs/maths/infix-to-postfix.js')

const parseLine = require('@srcs/parsing/input.js')
const infixToPostfix = require('@srcs/parsing/infix-to-postfix.js')
const { isFunction, isVariable, isComposite, compositeParts, isMatrix } = require('@srcs/parsing/utils.js')

const computeBuiltin = async (token, expression, variables) => {
  try {
    const name = token.substring(0, token.indexOf('('))
    const args = token.substring(token.indexOf('(') + 1, token.lastIndexOf(')')).split(',')

    for (let i = 0; i < args.length; i++) {
      const argumentStack = await parseLine(args[i])

      for (let j = 0; j < argumentStack.length; j++) {
        const variableIndex = expression.variables.indexOf(argumentStack[j])

        if (variableIndex >= 0) {
          let variable = variables[variableIndex]

          if (variable.constructor.name === 'String' && isValidBuiltin(variable)) {
            variable = await computeBuiltin(variable, expression, variables)
          } else if (variable.constructor.name === 'Numeral') {
            const { r: real, i: imaginary } = variable

            argumentStack[j] = `${real ? real : ''}${imaginary ? imaginary > 0 ? `+${imaginary}i` : `${imaginary}i` : ''}`

            if (!argumentStack[j].length) {
              argumentStack[j] = '0'
            }
          } else {
            throw new ComputorError({ data: { variable: name, expected: ['Builtin', 'Numeral'], found: variable.constructor.name }, code: 'incorrectDataType' })
          }
        }
      }
      args[i] = argumentStack.join('')
    }

    token = `${name}(${args.join(',')})`

    return await builtinHandler(token)
  } catch (error) {
    return Promise.reject(error)
  }
}

const computeNestedExpression = async (token, expression, variables) => {
  try {
    const func = isVariableRegistered(token)
    const name = sanitizeName(token)

    if (!func || func.constructor.name !== 'Expression') {
      if (isValidBuiltin(token)) {
        return await computeBuiltin(token, expression, variables)
      } else {
        throw new ComputorError({ data: { name }, code: 'unknownFunction' })
      }
    }

    const sign = (token[0] === '-' ? -1 : 1)
    const args = token.substring(token.indexOf('(') + 1, token.lastIndexOf(')')).split(',')

    for (let i = 0; i < args.length; i++) {
      if (isFunction(args[i]) || (isComposite(args[i]) && !isVariable(args[i]))) {
        args[i] = await computeNestedExpression(args[i], expression, variables)
      } else {
        const variableIndex = expression.variables.indexOf(args[i])
        
        if (variableIndex < 0 && !args[i].match(/^[+\-]?i$/) && isVariable(args[i])) {
          throw new ComputorError({ data: { parameter: args[i] }, code: 'illegalParameter' })
        } else if (variableIndex >= 0) {
          args[i] = variables[variableIndex]
        }
      }
    }

    const value = await Expression.evaluate(func, args)
    const constructor = value.constructor.name === 'Matrix' ? Matrix : Numeral

    return (sign < 0 ? constructor.opposite(value) : value)
  } catch (error) {
    return Promise.reject(error)
  }
}

const prettifyParameter = (parameter) => {
  if (isFunction(parameter) || (isComposite(parameter) && !parameter.match(/^[+\-]?\d+(\.\d+)?[a-z]+$/) && !isVariable(parameter))) {
    const name = parameter.substring(0, parameter.indexOf('('))
    const variables = parameter.substring(parameter.indexOf('(') + 1, parameter.lastIndexOf(')')).split(',')
    for (let i = 0; i < variables.length; i++) {
      variables[i] = prettifyParameter(variables[i])
    }

    return `\x1b[32;1m${name}\x1b[0;1m(${variables.join(', ')}\x1b[0;1m)`
  } else {
    let factor = 0
    let variableName = parameter
    if (isComposite(parameter)) {
      const parts = compositeParts(parameter)

      factor = parts.factor
      variableName = parts.variableName
    }

    if (factor) {
      return `\x1b[33m${factor}\x1b[0;1m * \x1b[33m ${variableName}\x1b[0;1m`
    } else {
      return `${prettifyExpression(variableName.split(/([+\-*/%^])/g))}`
    }
  }
}

const prettifyMatrix = (string) => {
  const matrixStack = []

  let buffer = ''

  for (let i = 0; i < string.length; i++) {
    if (string[i].match(/[+\-]/)) {
      if (buffer) {
        matrixStack.push(buffer, ' ', string[i], ' ')
        buffer = ''
      } else {
        buffer += string[i]
      }
    } else if (string[i] === ',') {
      matrixStack.push(buffer, ',', ' ')
      buffer = ''
    } else if (string[i].match(/[\d\.i]/)) {
      buffer += string[i]
    } else if (string[i].match(/[\];]/)) {
      if (buffer) {
        matrixStack.push(buffer, ' ', string[i])
        buffer = ''
      } else {
        matrixStack.push(string[i], ' ')
      }
    } else if (string[i] === '[') {
      if ((matrixStack[matrixStack.length - 1] || '').match(/[\[ ]/)) {
        matrixStack.push('[', ' ')
      } else {
        matrixStack.push('[')
      }
    } 
  }

  for (let i = 0; i < matrixStack.length; i++) {
    if (matrixStack[i].match(/^[+\-]?((\d+((\.\d+i?)?||i?)?)||i)$/)) {
      matrixStack[i] = `\x1b[33;1m${matrixStack[i]}\x1b[0;1m`
    }
  }

  return matrixStack
}

const prettifyExpression = (expression) => {
  const stack = []

  for (let i = 0; i < expression.length; i++) {
    if (!expression[i].match(/^[+\-\*\/%\^\(\)]$/) && expression[i].match(/^[+\-]?[a-z]+$|^[+\-]?[0-9\.]+$/)) {
      stack.push(`\x1b[33m${expression[i]}\x1b[0;1m`)
    } else if (!isFunction(expression[i]) && isComposite(expression[i])) {
      stack.push(`\x1b[33m${expression[i]}\x1b[0;1m`)
    } else if (isFunction(expression[i]) || isComposite(expression[i])) {
      const name = expression[i].substring(0, expression[i].indexOf('('))
      const variables = expression[i].substring(expression[i].indexOf('(') + 1, expression[i].lastIndexOf(')')).split(',')

      for (let i = 0; i < variables.length; i++) {
        variables[i] = prettifyParameter(variables[i])
      }
      
      stack.push(`\x1b[32;1m${name}\x1b[0;1m(${variables.join(', ')}\x1b[0;1m)`)
    } else if (isMatrix(expression[i])) {
      const matrixStack = prettifyMatrix(expression[i])

      stack.push(`\x1b[1m${matrixStack.join('')}\x1b[0m`)
    } else {
      stack.push(expression[i])
    }
  }

  let prettyString = stack.join(' ')

  // Removes space after left bracket and before right bracket to make the
  // output prettier.

  for (let i = 0; i < prettyString.length; i++) {
    if (prettyString[i] === ' ' && (prettyString[i - 1] === '(' || prettyString[i + 1] === ')')) {
      prettyString = prettyString.slice(0, i) + prettyString.slice(i + 1, prettyString.length)
    }
  }

  return prettyString
}

class Expression {
  constructor({ functionName, argumentList, infixExpression }) {
    this.name = functionName
    this.variables = argumentList
    this.definition = infixExpression
  }

  static async evaluate(expression, variables) {
    try {
      const { definition } = expression
      const infixStack = []

      for (let i = 0; i < definition.length; i++) {
        const variableIndex = expression.variables.indexOf(definition[i])

        if (variableIndex >= 0) {
          infixStack.push(variables[variableIndex])
        } else if (!isFunction(definition[i]) && isComposite(definition[i])) {
          const numeral = await numeralValue(definition[i])

          infixStack.push(numeral)
        } else if (definition[i] !== 'i' && (isFunction(definition[i]) || isComposite(definition[i]))) {
          const functionImage = await computeNestedExpression(definition[i], expression, variables)

          infixStack.push(functionImage)
        } else {
          infixStack.push(definition[i])
        }
      }

      const postfixNotation = infixToPostfix(infixStack)

      return await computePostfix(postfixNotation)
    } catch (error) {
      return Promise.reject(error)
    }

  }

  print() {
    const expression = prettifyExpression(this.definition)

    return `\x1b[32;1m${this.name}\x1b[0;1m(\x1b[33m${this.variables.join('\x1b[0;1m, \x1b[33m')}\x1b[0;1m) = ${expression}\x1b[0m`
  }
}

module.exports = Expression
