const commmandHandler = require('@srcs/handlers/command.js')
const { addToVariableList } = require('@srcs/handlers/variable.js')
const { numeralValue } = require('@srcs/maths/compute.js')
const createFunction = require('@srcs/parsing/function.js')
const { isFunction } = require('@srcs/parsing/utils.js')

const { env: { forbiddenVariables } } = Config

// Transform input string to lowercase only and remove all whitespaces
// then depending on the type of input, call the correct process.

module.exports = async (payload) => {
  const inputLine = payload.toLowerCase().replace(/^>| /g, '')

  if (inputLine === 'exit') {
    process.exit(0)
  }

  try {
    if (!inputLine.match(/^[0-9a-z+\-*\/%^()\[\]=!?.,]+$/)) {
      throw { data: inputLine, code: 'badInputFormat' }
    }
    if (inputLine.startsWith('!')) {
      await commmandHandler(inputLine)
    } else if (inputLine.endsWith('=?')) {
      return await numeralValue(inputLine.substring(0, inputLine.length - 2))
    } else if ((inputLine.match(/=/g) || []).length === 1) {
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

        return value
      } else if (!id.match(/^[a-z]+$/)) {
        throw { data: id, code: 'invalidVariableFormat' }
      } else if (forbiddenVariables.indexOf(id) !== -1) {
        throw { data: id, code: 'forbiddenVariableName' }
      } else {
        const value = await numeralValue(inputValue)

        addToVariableList(id, value)

        return value
      }
    } else {
      throw { data: inputLine, code: 'badInputFormat' }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
