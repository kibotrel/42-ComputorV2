const { isVariableRegistered } = require('@env/utils.js')

const { sanitizeName } = require('@env/utils.js')

const parseLine = require('@srcs/parsing/input.js')
const { isFunction } = require('@srcs/parsing/utils.js')

const sanitizeStack = (stack) => {
  const finalStack = []

  for (const token of stack) {
    if (token.match(/^(([a-z]+)|([+-]?([0-9]*)(\.([0-9]+))?))$/) || token.match(/^[+\-*/%^\(\)]$/) || isFunction(token)) {
      finalStack.push(token)
    } else if (token.match(/^[+-]?([0-9]*)(\.([0-9]+))?[a-z]+$/)){
      const breakpoint = /[a-z]/.exec(token).index
      let factor = token.substring(0, breakpoint)

      if (factor.length === 1 && factor[0].match(/[+\-]/)) {
        factor += '1'
      }
      const variable = token.substring(breakpoint, token.length)

      finalStack.push('(')
      finalStack.push(factor)
      finalStack.push('*')
      finalStack.push(variable)
      finalStack.push(')')
    }
  }

  return finalStack
}

module.exports = async (prototype, definition) => {
  try {
    const functionName =  prototype.substring(0, prototype.indexOf('('))
    const argumentList = prototype.substring(prototype.indexOf('(') + 1, prototype.indexOf(')')).split(',')
    const seenArguments = []

    for (const argument of argumentList) {
      if (!argument.match(/^[a-z]+$/) || argument === 'i') {
        throw { data: prototype, code: 'badInputFormat' }
      }

      if (seenArguments.indexOf(argument) > -1) {
        throw { data: prototype, code: 'repeatedVariableName' }
      } else {
        seenArguments.push(argument)
      }
    }

    const expression = await parseLine(definition)
    const infixExpression = sanitizeStack(expression)

    for (const token of infixExpression) {
      if ((token.length === 1 && token.match(/[a-z]/) && token[0] !== 'i') || (token.length > 1 && token.match(/^[a-z]+$/))) {
        if (argumentList.indexOf(token) === -1) {
          throw { data: token, code: 'unknownVariable' }
        }
      } else if (isFunction(token)) {
        if (!isVariableRegistered(token)) {
          throw { data: token, code: 'unknownFunction' }
        } else if (sanitizeName(token) === functionName) {
          throw { data: functionName, code: 'cyclicDeclaration' }
        }
      }
    }

    return new Expression({ functionName, argumentList, infixExpression })
  } catch (error) {
    return Promise.reject(error)
  }
}
