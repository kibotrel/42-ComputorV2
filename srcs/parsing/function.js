const { isVariableRegistered, isValidBuiltin } = require('@env/utils.js')

const { sanitizeName } = require('@env/utils.js')

const parseLine = require('@srcs/parsing/input.js')
const { isFunction } = require('@srcs/parsing/utils.js')

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

    const infixExpression = await parseLine(definition)

    for (const token of infixExpression) {
      if ((token.length === 1 && token.match(/[a-z]/) && token[0] !== 'i') || (token.length > 1 && token.match(/^[a-z]+$/))) {
        if (argumentList.indexOf(token) === -1) {
          throw { data: token, code: 'unknownVariable' }
        }
      } else if (isFunction(token)) {
        if (!isValidBuiltin(token) && !isVariableRegistered(token)) {
          const name = sanitizeName(token)

          throw new ComputorError({ data: { name }, code: 'unknownFunction' })
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
