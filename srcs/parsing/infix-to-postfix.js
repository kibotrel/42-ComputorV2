const Operators = require('@configs/operators.json')

// Implementation of the Shunting Yard Algorithm by Dijkstra
// to convert infix expression to postfix. More info on
// https://en.wikipedia.org/wiki/Shunting-yard_algorithm.

module.exports = (infixStack) => {
  const postfixStack = []
  const operatorStack = []

  for (const token of infixStack) {
    if (token.constructor.name !== 'String' || !token.match(/^[+\-*\/%^()]$/)) {
      postfixStack.push(token)
    } else if (token.match(/^[+\-*\/%^]$/)) {
      while (operatorStack.length) {
        const lastToken = operatorStack[operatorStack.length - 1]

        if (lastToken.match(/^[+\-*\/%^]$/)) {
          const o1 = Operators.find(element => element.symbol === token)
          const o2 = Operators.find(element => element.symbol === lastToken)

          if ((o1.associativity === 'l' && o1.precedence <= o2.precedence) || (o1.associativity === 'r' && o1.precedence < o2.precedence)) {
            postfixStack.push(operatorStack.pop())
          } else {
            break
          }
        } else {
          break
        }
      }
      operatorStack.push(token)
    } else if (token ===  '(') {
      operatorStack.push(token)
    } else if (token === ')') {
      while (operatorStack[operatorStack.length - 1] !== '(') {
        postfixStack.push(operatorStack.pop())
      }
      operatorStack.pop()
    }
  }

  while (operatorStack.length > 0) {
    postfixStack.push(operatorStack.pop())
  }

  return postfixStack
}
