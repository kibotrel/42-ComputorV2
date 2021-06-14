const { env: { forbiddenVariables } } = Config

const { registerHistory } = require('@env/history.js')

const commmandHandler = require('@handlers/command.js')
const { addToVariableList, resolveVariable } = require('@handlers/variable.js')

const { numeralValue } = require('@srcs/maths/compute.js')

const createFunction = require('@srcs/parsing/function.js')
const { isFunction } = require('@srcs/parsing/utils.js')

const storeVariable = async (inputLine) => {
  try {
    const { [0]: id, [1]: inputValue } = inputLine.split('=')

    if (!id || !inputValue) {
      throw { data: inputLine, code: 'badInputFormat' }
    } else if (isFunction(id)) {
      const value = await createFunction(id, inputValue)
      const realId = id.substring(0, id.indexOf('('))
      
      if (forbiddenVariables.indexOf(realId) !== -1) {
        throw { data: realId, code: 'forbiddenVariableName' }
      }

      addToVariableList(realId, value)

      return { value, type: 'expression' }
    } else if (!id.match(/^[a-z]+$/)) {
      throw { data: id, code: 'invalidVariableFormat' }
    } else if (forbiddenVariables.indexOf(id) !== -1) {
      throw { data: id, code: 'forbiddenVariableName' }
    } else {
      const value = await numeralValue(inputValue)

      addToVariableList(id, value)

      return { value, type: 'numeral' }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const computeInput = async (inputLine) => {
  try {
    const realInput = inputLine.substring(0, inputLine.length - 2)
    let value

    if (isFunction(realInput)) {
      value = await resolveVariable(realInput, 'Function')
    } else {
      value = await numeralValue(realInput)
    }
    
    return { value, type: 'computation' }
  } catch (error) {
    return Promise.reject(error)
  }
}

// Transform input string to lowercase only and remove all whitespaces
// then depending on the type of input, call the correct process.

module.exports = async (payload) => {
  try {
    let inputLine = payload.toLowerCase().replace(/^> /g, '').trim()

    registerHistory(inputLine)

    if (inputLine === 'exit') {
      process.exit(0)
    } 
    
    if (inputLine.startsWith('!')) {
      return await commmandHandler(inputLine)
    }

    inputLine = inputLine.replace(/ /g, '')

    if (!inputLine.match(/^[0-9a-z+\-*\/%^()\[\]=!?.,]+$/)) {
      throw { data: inputLine, code: 'badInputFormat' }
    }

    if (inputLine.endsWith('=?')) {
      return await computeInput(inputLine)
    } else if ((inputLine.match(/=/g) || []).length === 1) {
      return await storeVariable(inputLine)
    } else {
      throw { data: inputLine, code: 'badInputFormat' }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
