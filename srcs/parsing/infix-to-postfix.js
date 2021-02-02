const Operators = require('@configs/operators.json')

module.exports = (infixStack) => {
  const postfixStack = []
  const operatorStack = []

  for (const token of infixStack) {
    if (!token.match(/^[+\-*\/%^()]$/)) {
      postfixStack.push(token)
    } else if (token.match(/^[+\-*\/%^]$/)) {
      if (operatorStack.length) {
        const lastToken = operatorStack[operatorStack.length - 1]

        if (lastToken.match(/^[+\-*\/%^]$/)) {
          const o1 = Operators.find(element => element.symbol === token)
          const o2 = Operators.find(element => element.symbol === lastToken)

          if ((o1.associativity === 'l' && o1.precedence <= o2.precedence) || (o1.associativity === 'r' && o1.precedence < o2.precedence)) {
            postfixStack.push(operatorStack.pop())
          }
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
