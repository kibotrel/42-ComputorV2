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
    let definition = this.definition.join(' ')

    for (let i = 0; i < definition.length; i++) {
      if (definition[i] === ' ' && (definition[i - 1] === '(' ||definition[i + 1] === ')')) {
        definition = definition.slice(0, i) + definition.slice(i + 1, definition.length)
      }
    }
    return `${this.name}(${this.variables.join(', ')}) = ${definition}`
  }
}

module.exports = Expression
