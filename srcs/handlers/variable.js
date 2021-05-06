const { Variables } = global

const Expression = require('@classes/expression.js')

const { numeralValue } = require('@srcs/maths/compute.js')

const { isFunction } = require('@srcs/parsing/utils.js')

const addToVariableList = (id, value) => {
  const i = Variables.findIndex( variable => variable.id === id)
        
  if (i >= 0) {
    Variables[i].value = value
  } else {
    Variables.push({ id, value })
  }
}

const resolveVariable = async (request) => {
  try {
    if (request.length === 0) {
      throw { data: '=?', code: 'badInputFormat' }
    }

    for (let i = 0; i < Variables.length; i++) {
      if (Variables[i].id === request) {
        return Variables[i].value
      }
    }

    if (request.match(/^[a-z]+$/)) {
      throw { data: request, code: 'unknownVariable' }
    } else if (isFunction(request)) {
      const arguments = request.substring(request.indexOf('(') + 1, request.indexOf(')')).split(',')
      const functionName = request.substring(0, request.indexOf('('))
      const func = await resolveVariable(functionName)

      if (func.constructor.name != 'Expression') {
        throw { data: functionName, code: 'notFunction' }
      }

      const argumentList = []

      for (const argument of arguments) {
        const value = await numeralValue(argument)

        argumentList.push(value)
      }

      return await Expression.evaluate(func, argumentList)
    } else {
      return await numeralValue(request)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { resolveVariable, addToVariableList }