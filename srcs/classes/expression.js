const infixToPostfix = require('@srcs/parsing/infix-to-postfix.js')
const computePostfix = require('@srcs/maths/infix-to-postfix.js')

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

    const definitionStack = this.definition

    for (let i = 0; i < definitionStack.length; i++) {
      if (!definitionStack[i].match(/^[+\-\*\/%\^\(\)]$/)) {
        definitionStack[i] = `\x1b[33m${definitionStack[i]}\x1b[0;1m`
      }
    }
    let definition = definitionStack.join(' ')

    // Removes space after left bracket and before right bracket to make the
    // output prettier.

    for (let i = 0; i < definition.length; i++) {
      if (definition[i] === ' ' && (definition[i - 1] === '(' ||definition[i + 1] === ')')) {
        definition = definition.slice(0, i) + definition.slice(i + 1, definition.length)
      }
    }
    return `\x1b[32;1m${this.name}\x1b[0;1m(\x1b[33m${this.variables.join('\x1b[0;1m, \x1b[33m')}\x1b[0;1m) = ${definition}\x1b[0m`
  }
}

module.exports = Expression
