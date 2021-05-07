const { isVariableRegistered, sanitizeName } = require('@env/utils.js')

const { numeralValue } = require('@srcs/maths/compute.js')

const computeVariable = async (token, type) => {
  try {
    const variableName = sanitizeName(token)
    const sign = (token[0] === '-' ? -1 : 1)

    if (variableName === 'i') {
      return new Numeral({ r: 0, i: (sign < 0 ? -1 : 1) })
    }

    const variable = isVariableRegistered(variableName)

    if (!variable) {
      throw { data: variableName, code: `unknown${type}` }
    }

    // Add Matrix constructor later

    if (variable.constructor.name === 'Numeral') {
      if (sign < 0) {
        return await Numeral.substract(0, variable)
      } else {
        return variable
      }
    } else if (variable.constructor.name === 'Expression') {
      const fun = variable
      const arguments = token.substring(token.indexOf('(') + 1, token.indexOf(')')).split(',')
      const argumentList = []

      for (const argument of arguments) {
        const value = await numeralValue(argument)
    
        argumentList.push(value)
      }

      const value = await Expression.evaluate(fun, argumentList)

      if (sign < 0) {
        return await Nummeral.substract(0, value)
      } else {
        return value
      }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}


module.exports = { computeVariable }