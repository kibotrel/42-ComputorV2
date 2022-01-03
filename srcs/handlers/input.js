const { registerHistory } = require('@env/history.js')
const { isVariableRegistered } = require('@env/utils')

const commandHandler = require('@handlers/command.js')
const { addToVariableList, resolveVariable } = require('@handlers/variable.js')

const createFunction = require('@srcs/parsing/function.js')
const createMatrix = require('@srcs/parsing/matrix.js')
const { isFunction, isMatrix, compositeParts } = require('@srcs/parsing/utils.js')


const storeVariable = async (inputLine) => {
  try {
    const { [0]: id, [1]: inputValue } = inputLine.split('=')

    if (!id || !inputValue) {
      throw new ComputorError({ data: { string: inputLine }, code: 'badInputFormat' })
    } else if (isFunction(id)) {
      const value = await createFunction(id, inputValue)
      const realId = id.substring(0, id.indexOf('('))
      
      if (Config.env.forbiddenVariables.indexOf(realId) !== -1) {
        throw new ComputorError({ data: { name: realId }, code: 'forbiddenVariableName' })
      }

      addToVariableList(realId, value)

      return { value, type: 'expression' }
    } else if (!id.match(/^[a-z]+$/)) {
      throw new ComputorError({ data: { name: id }, code: 'invalidVariableFormat' })
    } else if (Config.env.forbiddenVariables.indexOf(id) !== -1) {
      throw new ComputorError({ data: { name: id }, code: 'forbiddenVariableName' })
    } else if (isMatrix(inputValue)) {
      const value = await createMatrix(inputValue)

      addToVariableList(id, value)

      return { value, type: 'matrix' }
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
      const { variableName } = compositeParts(realInput)
      const variable = isVariableRegistered(variableName)

      if (variable && variable.constructor.name === 'Expression') {
        value = await resolveVariable(realInput, 'Function')
      } else {
        value = await numeralValue(realInput)
      }
    } else if (isMatrix(realInput)) {
      value = await createMatrix(realInput)
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
      return await commandHandler(inputLine)
    }

    inputLine = inputLine.replace(/ /g, '')

    if (!inputLine.match(/^[0-9a-z+\-*\/%^()\[\]=!?.,;]+$/)) {
      throw new ComputorError({ data: { string: inputLine }, code: 'badInputFormat' })
    }

    if (inputLine.endsWith('=?')) {
      return await computeInput(inputLine)
    } else if ((inputLine.match(/=/g) || []).length === 1) {
      return await storeVariable(inputLine)
    } else {
      throw new ComputorError({ data: { string: inputLine }, code: 'badInputFormat' })
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
