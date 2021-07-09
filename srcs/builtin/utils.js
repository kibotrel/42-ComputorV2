const { isValidBuiltin } = require('@env/utils.js')

const { numeralValue } = require('@srcs/maths/compute.js')
const { toNumeral } = require('@srcs/maths/utils.js')

const sanitizeArguments = async ({ arguments, name, amount }) => {
  try {
    if (arguments.length !== amount) {
      throw { data: { name, arguments }, code: 'missingParameters' }
    }

    const sanitizedArguments = []
    
    for (const argument of arguments) {
      if (argument.constructor.name === 'String') {
        if (isValidBuiltin(argument)) {
          sanitizedArguments.push(await builtinHandler(argument))
        } else {
          sanitizedArguments.push(await numeralValue(argument))
        }
      } else {
        sanitizedArguments.push(new Numeral(toNumeral(argument)))
      }
    }

    return sanitizedArguments
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { sanitizeArguments }
