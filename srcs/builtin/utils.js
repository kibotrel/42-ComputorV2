const { isValidBuiltin } = require('@env/utils.js')

const { toNumeral } = require('@srcs/maths/utils.js')

const sanitizeArguments = async ({ arguments, name, amount }) => {
  try {
    if (arguments.length !== amount) {
      throw new ComputorError({ data: { name, found: arguments.length, expected: amount }, code: 'incorrectParameterAmount' })
    }

    const sanitizedArguments = []
    
    for (const argument of arguments) {
      if (argument.constructor.name === 'String') {
        if (isValidBuiltin(argument)) {
          sanitizedArguments.push(await builtinHandler(argument))
        } else {
          const value = await numeralValue(argument)

          if (value.constructor.name === 'Matrix') {
            throw new ComputorError({ code: 'builtinNotHandledOperator' })
          }
          sanitizedArguments.push(value)
        }
      } else if (argument.constructor.name === 'Numeral' || argument.constructor.name === 'Number') {
        sanitizedArguments.push(new Numeral(await toNumeral(argument)))
      } else {
        throw new ComputorError({ code: 'builtinNotHandledOperator' })
      }
    }

    return sanitizedArguments
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { sanitizeArguments }
