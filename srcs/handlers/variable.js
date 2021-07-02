const { Variables } = global

const builtinHandler = require('@handlers/built-in.js')

const { isVariableRegistered, isValidBuiltin } = require('@env/utils.js')

const { numeralValue } = require('@srcs/maths/compute.js')

const addToVariableList = (id, value) => {
  const i = Variables.findIndex( variable => variable.id === id)
        
  if (i >= 0) {
    Variables[i].value = value
  } else {
    Variables.push({ id, value })
  }
}

const resolveVariable = async (request, type) => {
  try {
    if (request.length === 0) {
      throw { data: '=?', code: 'badInputFormat' }
    }

    const variable = isVariableRegistered(request)
    
    if (!variable) {
      if (type === 'Function' && isValidBuiltin(request)) {
        return await builtinHandler(request)
      } else {
        throw { data: request, code: `unknown${type}` }
      }
    }

    if (type === 'Variable' && variable.constructor.name !== 'Numeral' || type === 'Function' && variable.constructor.name !== 'Expression') {
      throw { data: request, code: 'incorrectDataType' }
    }

    // Add Matrix constructor later
    
    if (variable.constructor.name === 'Numeral') {
      if (sign < 0) {
        return await Numeral.substract(0, variable)
      } else {
        return variable
      }
    } else if (variable.constructor.name === 'Expression') {
      const arguments = request.substring(request.indexOf('(') + 1, request.lastIndexOf(')')).split(',')
      const argumentList = []
      const func = variable
      const sign = (request[0] === '-' ? -1 : 1)

      if (!arguments[0]) {
        arguments.pop()
      }

      if (!arguments.length) {
        throw { data: variable.name, code: 'EmptyFunction' }
      } else if (arguments.length !== func.variables.length) {
        throw { data: { found: arguments.length, expected: func.variables.length }, code: 'missingParameters' }
      }
  
      for (const argument of arguments) {
        const value = await numeralValue(argument)

        argumentList.push(value)
      }

      const value = await Expression.evaluate(func, argumentList)

      if (sign < 0) {
        return await Numeral.substract(0, value)
      } else {
        return value
      }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { resolveVariable, addToVariableList }
