const { Variables } = global
const { numeralValue } = require('@srcs/maths/compute.js')

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
    } else {
      return await numeralValue(request)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { resolveVariable, addToVariableList }