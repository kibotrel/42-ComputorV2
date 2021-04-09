const Numeral = require('@classes/numeral')
const { decimalToIntegerScaling } = require('@srcs/maths/fractions.js')

const updateFlags = ({ power, number, operator, decimal, sign, numberStart, complex, variable }) => {
  const newFlags = {
    power,
    number,
    operator,
    decimal,
    sign,
    numberStart: numberStart === undefined ? -1 : numberStart,
    complex,
    variable,
  }

  return newFlags
}

const bracketsCheck = async (string, bracketStack) => {
  try {
    if (bracketStack.length > 0) {
      throw { data: string, code: 'invalidBracketEnclosure', index : string.length - 1 }
    } else if (!string[string.length - 1].match(/\d/) && string.length > 1 && string[string.length - 2] === '.') {
      throw { data: string, code: 'misformattedFloat', index: string.length - 1 }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const imaginaryCheck = async ({ string, flags }, infixStack) => {
  try {
    if (flags.complex && string[string.length - 1] === 'i') {
      if (string.length > 1) {
        if (flags.numberStart > -1 && infixStack[infixStack.length - flags.numberStart - 2] === ')') {
          infixStack.push('*')
        }
        if (flags.numberStart > -1) {
          if (string[flags.numberStart].match(/\d/) && string[flags.numberStart - 1] === ')') {
            throw { data: string, code: 'misformattedInteger', index: flags.numberStart }
          } else {
            let imaginaryFactor = string.substring(flags.numberStart, string.length - 1)
            
            infixStack.push('(')
            if (imaginaryFactor) {
              if (imaginaryFactor[imaginaryFactor.length - 1].match(/[+\-]/))
                imaginaryFactor += '1'
              infixStack.push(imaginaryFactor)
            } else {
              infixStack.push('1')
            }
            if (infixStack[infixStack.length - 1] !== '*') {
              infixStack.push('*')
            }
          }
        }
      } else {
        infixStack.push('(')
        infixStack.push('1')
        infixStack.push('*')
      }
      infixStack.push('i')
      infixStack.push(')')
    } else if (flags.complex) {
      throw { data: string, code : 'illegalImaginary', index: string.length - 1 }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const formatCheck = async (string) => {
  try {
    if (string[string.length - 1] === '.') {
      throw { data: string, code: 'misformattedFloat', index: string.length - 1 }
    } else if (string[string.length - 1].match(/[\-+*%\/^]/)) {
      throw { data: string, code: 'invalidOperatorPosition', index: string.length - 1 }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const digitsCheck = async ({ string, flags }, infixStack) => {
  try {
    if (string[string.length - 1].match(/\d/)) {
      if (string.length > 1 && infixStack[infixStack.length - 1] === ')') {
        throw { data: string, code: 'misformattedInteger', index: string.length - 1 }
      }

      if (flags.numberStart > -1) {
        infixStack.push(string.substring(flags.numberStart, string.length))
      }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const variableCheck = async ({ string, flags }, infixStack) => {
  try {
    if (flags.variable && flags.numberStart > -1) {
      infixStack.push(string.substring(flags.numberStart, string.length))
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const parseImaginary = (token) => {
  if (token[0] === '-' && token[1] === 'i') {
    return new Numeral({ r: 0, i: -1, ni: -1, di: 1 })
  } else if ((token[0] === '+' && token[1] === 'i') || token[0] === 'i') {
    return new Numeral({ r: 0, i: 1,  ni: 1, di: 1 })
  } else {
    const value = parseFloat(token)
    const { n: ni, d: di } = decimalToIntegerScaling({ number: value })

    return new Numeral({ r: 0, i: value, ni, di })
  }
}

const isFunction = (token) => {
  return token.match(/^[+\-]?[a-z]+\(([+\-]?[a-z]+|([+\-]?\d+(\.\d+)?)?([+\-]?\d+(\.\d+)?\*?i)?)(,([+\-]?[a-z]+|([+\-]?\d+(\.\d+)?)?([+\-]?\d+(\.\d+)?\*?i)?)*)?\)$/)
}

module.exports = { isFunction, updateFlags, formatCheck, variableCheck, imaginaryCheck, digitsCheck, bracketsCheck, parseImaginary }
