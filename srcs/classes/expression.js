const computePostfix = require('@srcs/maths/infix-to-postfix.js')

const infixToPostfix = require('@srcs/parsing/infix-to-postfix.js')
const { isFunction } = require('@srcs/parsing/utils.js')

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
    // Turns variable into bold yellow to represent numeral values.

    const definitionStack = []

    for (let i = 0; i < this.definition.length; i++) {
      if (!this.definition[i].match(/^[+\-\*\/%\^\(\)]$/) && this.definition[i].match(/^[a-z]+$|^[+\-]?[0-9\.]+$/)) {
        definitionStack.push(`\x1b[33m${this.definition[i]}\x1b[0;1m`)
      } else if (isFunction(this.definition[i])) {
        const name = this.definition[i].substring(0, this.definition[i].indexOf('('))
        const variables = this.definition[i].substring(this.definition[i].indexOf('(') + 1, this.definition[i].indexOf(')')).split(',')
        
        definitionStack.push(`\x1b[32;1m${name}\x1b[0;1m(\x1b[33m${variables.join('\x1b[0;1m, \x1b[33m')}\x1b[0;1m)`)
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
