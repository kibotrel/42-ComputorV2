const { updateFlags } = require('@srcs/parsing/utils.js')
const { leftBracket, rightBracket } = require('@srcs/parsing/brackets.js')
const { number, decimal, variable } = require('@srcs/parsing/operands.js')
const { bracketsCheck, digitsCheck, imaginaryCheck, formatCheck, variableCheck } = require('@srcs/parsing/utils.js')
const operator = require('@srcs/parsing/operators.js')

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
    for (let i = 0; i < string.length; i++) {
      if (string[i] === '(') {
        await leftBracket({ string, i }, flags, infixStack, bracketStack)
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

    return infixStack
  } catch (error) {
    return Promise.reject(error)
  }
}
