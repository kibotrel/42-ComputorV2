const { isValidBuiltin } = require('@env/utils.js')

const {
  leftBracket,
  rightBracket,
  matrixOpen,
  matrixClose
} = require('@srcs/parsing/brackets.js')
const { number, decimal, variable } = require('@srcs/parsing/operands.js')
const {
  bracketsCheck,
  digitsCheck,
  imaginaryCheck,
  formatCheck,
  variableCheck,
  updateFlags, 
  isFunction,
  isNumber,
  isVariable,
  isSyntax,
  isComposite,
  compositeParts,
  isMatrix
} = require('@srcs/parsing/utils.js')
const operator = require('@srcs/parsing/operators.js')

// This function is here to detect composite opperands to break
// them in distinct opperands, adding immplicit multiplications
// and keeping the right operating priorities then repopulating
// the stack accordingly for future computations.

const sanitizeStack = async (infixStack) => {
  try  {
    const finalStack = []

    for (const token of infixStack) {
      if (isSyntax(token)) {
        finalStack.push(token)
      } else if (isNumber(token) || isVariable(token) || isFunction(token) || isValidBuiltin(token)) {
        if (finalStack[finalStack.length - 1] === ')') {
          finalStack.push('*')
        }

        finalStack.push(token)
      } else if (isComposite(token)){
        const { variableName, factor } = compositeParts(token)

        if (finalStack[finalStack.length - 1] === ')') {
          finalStack.push('*')
        }

        if (isVariable(variableName) || isFunction(variableName) || isValidBuiltin(variableName) || isComposite(variableName)) {
          if (factor) {
            if (factor.length === 1 && factor.match(/[+\-]/)) {
              factor = `${factor}1`
            }
            finalStack.push('(', factor, '*', variableName, ')')
          } else {
            finalStack.push(variableName)
          }
        } else {
          throw new ComputorError({ code: 'illegalCharacter' })
        }
      } else if (isMatrix(token)) {
        finalStack.push(token)
      } else {
        throw new ComputorError({ code: 'illegalCharacter' })
      }
    }

    return finalStack
  } catch (error) {
    return Promise.reject(error)
  }
}

const lastChecks = async ({ string, flags }, infixStack, bracketStack) => {
  try {
    await bracketsCheck(string, bracketStack)
    await digitsCheck({ string, flags }, infixStack)
    await imaginaryCheck({ string, flags }, infixStack)
    await formatCheck(string)
    await variableCheck({ string, flags }, infixStack)
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = async (string) => {
  const bracketStack = []
  const infixStack = []

  let flags = updateFlags({ numberStart: -1 })

  try {
    if (!string) {
      throw new ComputorError({ code: 'emptyExpression' })
    } 

    for (let i = 0; i < string.length; i++) {
      if (string[i] === '[') {
        i = await matrixOpen(string, i, flags, infixStack)
      } else if (string[i] === ']') {
        await matrixClose(string, i, flags, infixStack)
        flags = updateFlags({ numberStart: -1 })
      } else if (string[i] === '(') {
        i = await leftBracket({ string, i }, flags, infixStack, bracketStack)
        flags = updateFlags({ numberStart: -1 })
      } else if (string[i] === ')') {
        await rightBracket({ string, i }, flags, infixStack, bracketStack)
        flags = updateFlags({ numberStart: -1 })
      } else if (string[i].match(/[+\-*\/%^]/)) {
        await operator({ string, i }, flags, infixStack)
      } else if (string[i].match(/\d/)) {
        await number({ string, i }, flags)
      } else if (string[i] === '.') {
        await decimal({ string, i }, flags)
      } else if (string[i].match(/[a-z]/)) {
        await variable({ string, i }, flags, infixStack)
      }
    }

    await lastChecks({ string, flags }, infixStack, bracketStack)

    return await sanitizeStack(infixStack)
  } catch (error) {
    return Promise.reject(error)
  }
}