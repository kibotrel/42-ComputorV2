const { updateFlags } = require('@srcs/parsing/utils.js')
const { leftBracket, rightBracket } = require('@srcs/parsing/brackets.js')
const { variable, decimal } = require('@srcs/parsing/operands.js')
const operator = require('@srcs/parsing/operators.js')

const lastChecks = async ({ string, flags }, infixStack, bracketStack) => {
  try {
    if (bracketStack.length > 0) {
      throw { data: string, code: 'invalidBracketEnclosure', index : string.length - 1 }
    }

    if (string[string.length - 1].match(/\d/)) {
      if (string.length > 1 && infixStack[infixStack.length - 1] === ')') {
        throw { data: string, code: 'misformattedInteger', index: string.length - 1 }
      }

      if (flags.numberStart !== -1) {
        infixStack.push(string.substring(flags.numberStart, string.length))
      }
    }

    if (string[string.length - 1] === '.') {
      throw { data: string, code: 'misformattedFloat', index: string.length - 1 }
    } else if (string[string.length - 1].match(/[\-+*%\/^]/)) {
      throw { data: string, code: 'invalidOperatorPosition', index: string.length - 1 }
    }
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
        flags = await leftBracket({ string, i, numberStart: flags.numberStart }, infixStack, bracketStack)
      } else if (string[i] === ')') {
        flags = await rightBracket({ string, i, flags }, infixStack, bracketStack)
      } else if (string[i].match(/[+\-*\/%^]/)) {
        flags = await operator({ string, i, flags }, infixStack)
      } else if (string[i].match(/\d/)) {
        flags = variable({ string, i, flags })
      } else if (string[i] === '.') {
        flags = await decimal({ string, i, flags })
      }
    }

    await lastChecks({ string, flags }, infixStack, bracketStack)

    return infixStack
  } catch (error) {
    return Promise.reject(error)
  }
}
