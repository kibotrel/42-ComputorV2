const { isVariableRegistered, isValidBuiltin, sanitizeName } = require('@env/utils.js')

const { resolveVariable } = require('@handlers/variable.js')

const { numeralValue } = require('@srcs/maths/compute.js')

const parseLine = require('@srcs/parsing/input.js')
const { isFunction } = require('@srcs/parsing/utils.js')

module.exports = async (prototype, definition) => {
  try {
    const functionName =  prototype.substring(0, prototype.indexOf('('))
    const argumentList = prototype.substring(prototype.indexOf('(') + 1, prototype.indexOf(')')).split(',')
    const seenArguments = []

    for (const argument of argumentList) {
      if (!argument.match(/^[a-z]+$/) || argument === 'i') {
        throw new ComputorError({ data: { string: prototype }, code: 'badInputFormat' })
      }

      if (seenArguments.indexOf(argument) > -1) {
        throw new ComputorError({ data: { variable: argument }, code: 'repeatedVariableName' })
      } else {
        seenArguments.push(argument)
      }
    }

    const infixExpression = await parseLine(definition)
  
    for (const token of infixExpression) {
      const index = infixExpression.indexOf(token)
  
      if ((token.length === 1 && token.match(/[a-z]/) && token[0] !== 'i') || (token.length > 1 && token.match(/^[a-z]+$/))) {
        if (argumentList.indexOf(token) === -1) {
          const numeral = await numeralValue(token)

          infixExpression[index] = numeral.toString()          
        }
      } else if (isFunction(token)) {
        const storedVariable = isVariableRegistered(token)
  
        if (isValidBuiltin(token)) {
          const numeral = await builtinHandler(token)

          infixExpression[index] = numeral.toString()
        } else if (sanitizeName(token) === functionName) {
          throw new ComputorError({ data: { expression: functionName }, code: 'cyclicDeclaration' })
        } else {
          const result = await resolveVariable(token, 'Function')
          
          infixExpression[index] = result.toString()
        }
      }
    }

    return new Expression({ functionName, argumentList, infixExpression })
  } catch (error) {
    return Promise.reject(error)
  }
}
