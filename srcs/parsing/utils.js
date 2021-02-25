const Numeral = require('@classes/numeral')

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

            if (imaginaryFactor) {
              if (imaginaryFactor[imaginaryFactor.length - 1].match(/[+\-]/))
                imaginaryFactor += '1'
              infixStack.push(imaginaryFactor)
            }
            if (infixStack[infixStack.length - 1] !== '*') {
              infixStack.push('*')
            }
          }
        }
      } else {
        infixStack.push('1')
        infixStack.push('*')
      }
      infixStack.push('i')
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

const parseImaginary = async (token) => {
  let number = 0
  const flags = {
    digit: false,
    decimal: false,
    numberBoundary: false
  }

  try {
    for (let i = 0; i < token.length; i++) {
      if (token[i].match(/\d/)) {
        if (flags.numberBoundary) {
          throw { data: token, code: 'badOperand' }
        } else {
          flags.digit = true
        }
      } else if (token[i] == '.') {
        if (!flags.digit || flags.decimal || flags.numberBoundary || (token.length - i > 1 && !token[i + 1].match(/\d/))) {
          throw { data: token, code: 'misformattedFloat' }
        } else {
          flags.decimal = true
        }
      } else if (token[i] === 'i') {
         flags.numberBoundary = true
      }//FINIR CA
    }
    return new Numeral({ r: 0, i: parseFloat(token) })
  } catch (error) {
    return Promise.reject(error)
  }
}
module.exports = { updateFlags, formatCheck, imaginaryCheck, digitsCheck, bracketsCheck, parseImaginary }
