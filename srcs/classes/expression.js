class Expression {
  constructor({ functionName, argumentList, infixExpression }) {
    this.name = functionName
    this.variables = argumentList
    this.definition = infixExpression
  }

  static async evaluate(expression, variables) {

  }

  print() {
    return `${this.definition.join(' ')}`
  }
}

module.exports = Expression