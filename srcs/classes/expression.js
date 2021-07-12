const { isVariableRegistered, isValidBuiltin } = require('@env/utils.js')

const computePostfix = require('@srcs/maths/infix-to-postfix.js')

const parseLine = require('@srcs/parsing/input.js')
const infixToPostfix = require('@srcs/parsing/infix-to-postfix.js')
const { isFunction, isVariable, isComposite } = require('@srcs/parsing/utils.js')

const computeBuiltin = async (token, expression, variables) => {
  try {
    const name =  token.substring(0, token.indexOf('('))
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

            argumentStack[i] = `${real ? real : ''}${imaginary ? imaginary > 0 ? `+${imaginary}i` : `${imaginary}i` : ''}`

            if (!argumentStack[i].length) {
              argumentStack[i] = '0'
            }
          } else {
            throw { data: variable, code: 'incorrectDataType' }
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

    if (!func || func.constructor.name !== 'Expression') {
      if (isValidBuiltin(token)) {
        return await computeBuiltin(token, expression, variables)
      } else {
        throw { data: token, code: 'unknownFunction' }
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
          throw { data: args[i], code: 'illegalParameter'}
        } else if (variableIndex >= 0) {
          args[i] = variables[variableIndex]
        }
      }
    }

    const value = await Expression.evaluate(func, args)

    if (sign < 0) {
      return await Numeral.substract(0, value)
    } else {
      return value
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const prettifyParameter = (parameter) => {
  if (isFunction(parameter) || (isComposite(parameter) && !isVariable(parameter))) {
    const name = parameter.substring(0, parameter.indexOf('('))
    const variables = parameter.substring(parameter.indexOf('(') + 1, parameter.lastIndexOf(')')).split(',')
    for (let i = 0; i < variables.length; i++) {
      variables[i] = prettifyParameter(variables[i])
    }

    return `\x1b[32;1m${name}\x1b[0;1m(${variables.join(', ')}\x1b[0;1m)`
  } else {
    return `\x1b[33m${parameter}\x1b[0;1m`
  }
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
        } else if (isFunction(definition[i]) || isComposite(definition[i])) {
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
    const definitionStack = []

    // Turns variables and numeral values in bold yellow and Expressions
    // in bold green.

    for (let i = 0; i < this.definition.length; i++) {
      if (!this.definition[i].match(/^[+\-\*\/%\^\(\)]$/) && this.definition[i].match(/^[+\-]?[a-z]+$|^[+\-]?[0-9\.]+$/)) {
        definitionStack.push(`\x1b[33m${this.definition[i]}\x1b[0;1m`)
      } else if (isFunction(this.definition[i]) || isComposite(this.definition[i])) {
        const name = this.definition[i].substring(0, this.definition[i].indexOf('('))
        const variables = this.definition[i].substring(this.definition[i].indexOf('(') + 1, this.definition[i].lastIndexOf(')')).split(',')

        for (let i = 0; i < variables.length; i++) {
          variables[i] = prettifyParameter(variables[i])
        }
        
        definitionStack.push(`\x1b[32;1m${name}\x1b[0;1m(${variables.join(', ')}\x1b[0;1m)`)
      } else {
        definitionStack.push(this.definition[i])
      }
    }
  
    let expression = definitionStack.join(' ')

    // Removes space after left bracket and before right bracket to make the
    // output prettier.

    for (let i = 0; i < expression.length; i++) {
      if (expression[i] === ' ' && (expression[i - 1] === '(' || expression[i + 1] === ')')) {
        expression = expression.slice(0, i) + expression.slice(i + 1, expression.length)
      }
    }

    return `\x1b[32;1m${this.name}\x1b[0;1m(\x1b[33m${this.variables.join('\x1b[0;1m, \x1b[33m')}\x1b[0;1m) = ${expression}\x1b[0m`
  }
}

module.exports = Expression
