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
      throw new ComputorError({ data: { string }, code: 'invalidBracketEnclosure' })
    } else if (!string[string.length - 1].match(/\d/) && string.length > 1 && string[string.length - 2] === '.') {
      throw new ComputorError({ data: { string, index: string.length - 1 }, code: 'misformattedFloat' })
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const imaginaryCheck = async ({ string, flags }, infixStack) => {
  try {
    if (flags.complex && string[string.length - 1] === 'i') {
      if (string.length >= 1 && flags.numberStart > -1) {
        let imaginaryFactor = string.substring(flags.numberStart, string.length - 1)
        
        if (imaginaryFactor) {
          if (imaginaryFactor[imaginaryFactor.length - 1].match(/[+\-]/)) {
            imaginaryFactor += '1'
          }
        }

        infixStack.push(`${imaginaryFactor}i`)
      }
    } else if (flags.complex) {
      throw new ComputorError({ data: { string, index: string.length - 1 }, code : 'illegalImaginary' })
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const formatCheck = async (string) => {
  try {
    if (string[string.length - 1] === '.') {
      throw new ComputorError({ data: { string, index: string.length - 1 }, code: 'misformattedFloat' })
    } else if (string[string.length - 1].match(/[\-+*%\/^]/)) {
      throw new ComputorError({ data: { string, index: string.length - 1 }, code: 'invalidOperatorPosition' })
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const digitsCheck = async ({ string, flags }, infixStack) => {
  try {
    if (string[string.length - 1].match(/\d/)) {
      if (string.length > 1 && infixStack[infixStack.length - 1] === ')') {
        throw new ComputorError({ data: { string, index: string.length - 1 }, code: 'misformattedInteger' })
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

const compositeParts = (token) => {
  const firstHalf = token.split('(')[0]
  let breakpoint = 0

  for (let i = 0; i < firstHalf.length; i++) {
    if (i > 0 && !firstHalf[i].match(/[\d\.]/) && firstHalf[i - 1].match(/\d/)) {
      breakpoint = i
      break
    }
  }

  const variableName = token.substring(breakpoint, token.length)
  let factor = token.substring(0, breakpoint)

  if (factor.length === 1 && factor.match(/[+\-]/)) {
    factor = `${factor}1`
  }

  return { variableName, factor }
}

const isFunction = (token) => {
  return token.match(/^[+\-]?[a-z]+\(([+\-]?(\([+\-]?)?(((\d+(\.\d+)?)?[a-z]+)|(\d+(\.\d+)?([a-z]+)?))([+\-\/\*%^](\([+\-]?)?(((\d+(\.\d+)?)?[a-z]+)|(\d+(\.\d+)?([a-z]+)?))\)?)*)(,([+\-]?(\([+\-]?)?(((\d+(\.\d+)?)?[a-z]+)|(\d+(\.\d+)?([a-z]+)?))([+\-\/\*%^](\([+\-]?)?(((\d+(\.\d+)?)?[a-z]+)|(\d+(\.\d+)?([a-z]+)?))\)?)*))*\)$/)
}

const isNumber = (token) => {
  return token.match(/^[+\-]?\d+(\.\d+)?$/)
}

const isVariable = (token) => {
  return token.match(/^[+\-]?[a-z]+$/)
}

const isSyntax = (token) => {
  return token.match(/^[+\-*/%^\(\)]$/)
}

const isComposite = (token) => {
  return token.match(/^[+\-]?(\d+(\.\d+)?)?[a-z]+(\(.*\))?$/)
}

module.exports = { isFunction, isNumber, isVariable, isSyntax, isComposite, compositeParts, updateFlags, formatCheck, variableCheck, imaginaryCheck, digitsCheck, bracketsCheck, parseImaginary }
