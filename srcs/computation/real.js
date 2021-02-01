const Operators = require('@configs/operators.json')

const setFlags = ({ power, number, operator, decimal, sign, numberStart }) => {
  return { power, number, operator, decimal, sign, numberStart: numberStart === undefined ? -1 : numberStart }
}

const leftBracketCheck = async ({ string, i, numberStart }, infixStack, bracketStack) => {
  try {
    if (numberStart !== -1) {
      infixStack.push(string.substring(numberStart, i))
    }

    if (i !== 0) {
      if (string[i - 1].match(/[\d)]/)) {
        infixStack.push('*')
      } else if (string[i - 1] === '.') {
        throw { data: string, code: 'ILLEGAL_LEFT_BRACKET', index: i }
      }
    }

    infixStack.push('(')
    bracketStack.push(1)

    return setFlags({})
  } catch (error) {
    console.log("left")
    return Promise.reject(error)
  }
}

const rightBracketCheck = async ({ string, i, flags }, infixStack, bracketStack) => {
  try {
    const lastElement = bracketStack.pop()

    if (lastElement === undefined || flags.operator || (i !== 0 && flags.decimal && string[i - 1] === '.')) {
      throw { data: string, code: 'ILLEGAL_RIGHT_BRACKET', index: i }
    } else if (flags.numberStart !== -1) {
      infixStack.push(string.substring(flags.numberStart, i))
    }

    infixStack.push(')')

    return setFlags({})
  } catch (error) {
    console.log("right")
    return Promise.reject(error)
  }
}

const operatorCheck = async ({ string, i, flags }, infixStack) => {
  try {
    if (flags.numberStart !== -1) {
      infixStack.push(string.substring(flags.numberStart, i))
      flags.number = false
      flags.decimal = false
      flags.numberStart = -1
    }

    if (flags.operator || string[i].match(/[*\/%^]/) && (i === 0 || flags.number)) {
      throw { data: string, code: 'ILLEGAL_OPERATOR', index: i }
    } else if (string[i].match(/[*\/%^]/) && flags.decimal && !string[i - 1].match(/\d/)) {
      throw { data: string, code: 'ILLEGAL_FLOAT', index: i - 1 }
    } 
    
    flags.power = false

    if (string[i] === '^') {
      flags.power = true
    }

    if (string[i].match(/[+\-]/) && (i === 0 || string[i - 1] === '(')) {
      flags.sign = true
      flags.numberStart = i
    } else {
      infixStack.push(string[i])
    }

    return setFlags({ power: flags.power, operator: true, sign: flags.sign, numberStart: flags.numberStart })
  } catch (error) {
    console.log("operator")
    return Promise.reject(error)
  }
}

const variableCheck = ({ string, i, flags }) => {
  if (!flags.number && !flags.sign) {
    flags.numberStart = i
  }

  return setFlags({ number: true, numberStart: flags.numberStart})
}

const decimalCheck = async ({ string, i, flags }) => {
  try {
    if (!flags.number || flags.decimal) {
      throw { data: string, code: 'ILLEGAL_FLOAT', index: i }
    } else {
      return setFlags({ number: true, decimal: true, numberStart: flags.numberStart })
    }
  } catch (error) {
    console.log("decimal")
    return Promise.reject(error)
  }
}

const lastCharacterCheck = async ({ string, flags }, infixStack, bracketStack) => {
  try {
    if (bracketStack.length > 0) {
      throw { data: string, code: 'ILLEGAL_BRACKETS', index : string.length - 1 }
    }

    if (string[string.length - 1].match(/\d/)) {
      if (string.length > 1 && infixStack[infixStack.length - 1] === ')') {
        throw { data: string, code: 'ILLEGAL_NUMBER', index: string.length - 1 }
      }

      if (flags.numberStart !== -1) {
        infixStack.push(string.substring(flags.numberStart, string.length))
      }
    }

    if (string[string.length - 1] === '.') {
      throw { data: string, code: 'ILLEGAL_FLOAT', index: string.length - 1 }
    } else if (string[string.length - 1].match(/[\-+*%\/^]/)) {
      throw { data: string, code: 'ILLEGAL_OPERATOR', index: string.length - 1 }
    }
  } catch (error) {
    console.log("last")
    return Promise.reject(error)
  }
}

const isValid = async (string) => {
  const bracketStack = []
  const infixStack = []

  let flags = setFlags({ numberStart: -1 })

  try {
    for (let i = 0; i < string.length; i++) {
      if (string[i] === '(') {
        flags = await leftBracketCheck({ string, i, numberStart: flags.numberStart }, infixStack, bracketStack)
      } else if (string[i] === ')') {
        flags = await rightBracketCheck({ string, i, flags }, infixStack, bracketStack)
      } else if (string[i].match(/[+\-*\/%^]/)) {
        flags = await operatorCheck({ string, i, flags }, infixStack)
      } else if (string[i].match(/\d/)) {
        flags = variableCheck({ string, i, flags })
      } else if (string[i] === '.') {
        flags = await decimalCheck({ string, i, flags })
      }
    }

    await lastCharacterCheck({ string, flags }, infixStack, bracketStack)

    return infixStack
  } catch (error) {
    return Promise.reject(error)
  }
}

const shuntingYardAlgorithm = (infixStack) => {
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

const opperation = ({ o1, operator, o2 }) => {
  switch (operator) {
    case '+':
      return parseFloat(o1) + parseFloat(o2)
    case '-':
      return parseFloat(o1) - parseFloat(o2)
    case '*':
      return parseFloat(o1) * parseFloat(o2)
    case '/':
      return parseFloat(o1) / parseFloat(o2)
    case '%':
      return parseFloat(o1) % parseFloat(o2)
    case '^':
      return Math.pow(parseFloat(o1), parseFloat(o2))
  }
}

const compute = (suffixStack) => {
  const computeStack = []

  for (const token of suffixStack) {
    if (!token.match(/^[+\-*\/%^]$/)) {
      computeStack.push(token)
    } else {
      const o2 = computeStack.pop()
      const o1 = computeStack.pop()

      computeStack.push(opperation({ o1, operator: token, o2 }))
    }
  }

  return parseFloat(computeStack.pop())
}

module.exports = async (string) => {
  try {
    const infixNotation = await isValid(string)

    const suffixNotation = shuntingYardAlgorithm(infixNotation)

    return compute(suffixNotation)
  } catch (error) {
    return Promise.reject(error)
  }
}