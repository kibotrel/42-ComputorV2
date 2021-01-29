const operators = require('@configs/operators.json')

const setFlags = ({ power, number, operator, decimal, sign, numberStart }) => {
  return { power, number, operator, decimal, sign, numberStart: numberStart === undefined ? -1 : numberStart }
}

const leftBracketCheck = async ({ string, i, numberStart }, infixStack, bracketStack) => {
  try {
    if (numberStart !== -1) {
      infixStack.push(string.substring(numberStart, i))
    }

    if (i !== 0) {
      if (string[i - 1].match(/\d/)) {
        infixStack.push('*')
      } else if (string[i - 1] === '.') {
        throw { data: string, error: 'ILLEGAL_LEFT_BRACKET', errorIndex: i }
      }
    }

    infixStack.push('(')
    bracketStack.push(1)

    return setFlags({})
  } catch (error) {
    return Promise.reject(error)
  }
}

const rightBracketCheck = async ({ string, i, flags }, infixStack, bracketStack) => {
  try {
    const lastElement = bracketStack.pop()

    if (lastElement === undefined || flags.operator || (i !== 0 && flags.decimal && string[i - 1] === '.')) {
      throw { data: string, error: 'ILLEGAL_RIGHT_BRACKET', errorIndex: i }
    } else if (flags.numberStart !== -1) {
      infixStack.push(string.substring(flags.numberStart, i))
    }

    infixStack.push(')')

    return setFlags({})
  } catch (error) {
    return Promise.reject(error)
  }
}

const operatorCheck = async ({ string, i, flags }, infixStack) => {
  try {
    if (flags.operator || string[i].match(/[*\/%^]/) && (i === 0 || flags.number)) {
      throw { data: string, error: 'ILLEGAL_OPERATOR', errorIndex: i }
    } else if (string[i].match(/[*\/%^]/) && flags.decimal && !string[i - 1].match(/\d/)) {
      throw { data: string, error: 'ILLEGAL_FLOAT', errorIndex: i - 1 }
    } 
    
    flags.power = false

    if (string[i] === '^') {
      flags.power = true
    }

    if (flags.numberStart !== -1) {
      infixStack.push(string.substring(flags.numberStart, i))
    }

    if (string[i].match(/[+\-]/) && (i === 0 || string[i - 1] === '(')) {
      flags.sign = true
      flags.numberStart = i
    } else {
      infixStack.push(string[i])
    }

    return setFlags({ power: flags.power, operator: true, sign: flags.sign, numberStart: flags.numberStart })
  } catch (error) {
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
      throw { data: string, error: 'ILLEGAL_FLOAT', errorIndex: i }
    } else {
      return setFlags({ number: true, decimal: true, numberStart: flags.numberStart })
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const lastCharacterCheck = async ({ string, flags }, infixStack, bracketStack) => {
  try {
    if (bracketStack.length > 0) {
      throw { data: string, code: 'ILLEGAL_BRACKETS', errorIndex : string.length - 1 }
    }

    if (string[string.length - 1].match(/\d/) && flags.numberStart !== -1) {
      infixStack.push(string.substring(flags.numberStart, string.length))
    }

    if (string[string.length - 1] === '.') {
      throw { data: string, code: 'ILLEGAL_FLOAT', errorIndex: string.length - 1 }
    } else if (string[string.length - 1].match(/[\-+*%\/^]/)) {
      throw { data: string, code: 'ILLEGAL_OPERATOR', errorIndex: string.length - 1 }
    }
  } catch (error) {
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

const suffixNotation = (expression) => {
  console.log(expression)
}

module.exports = async (expression) => {
  try {
    const infixNotation = await isValid(expression)

    suffixNotation(infixNotation)

    return undefined
  } catch (error) {
    return Promise.reject(error)
  }
}