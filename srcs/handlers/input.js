const commmandHandler = require('@srcs/handlers/command.js')
const { resolveVariable, addToVariableList } = require('@srcs/handlers/variable.js')
const expressionValue = require('@srcs/maths/compute.js')

const { env: { forbiddenVariables } } = Config

// Transform input string to lowercase only and remove all whitespaces
// then depending on the type of input, call the correct process.

module.exports = async (payload) => {
  const inputLine = payload.toLowerCase().replace(/^>| /g, '')

  if (inputLine === 'exit') {
    process.exit(0)
  }

  try {
    if (!inputLine.match(/^[0-9a-z+\-*\/%^()\[\]=!?.]+$/)) {
      throw { data: inputLine, code: "badInputFormat" }
    }

    if (inputLine.startsWith('!')) {
      await commmandHandler(inputLine)
    } else if (inputLine.endsWith('=?')) {
      return await resolveVariable(inputLine.substring(0, inputLine.length - 2))
    } else if ((inputLine.match(/=/g) || []).length === 1) {
      const { [0]: id, [1]: inputValue } = inputLine.split('=')

      if (!id || !id.match(/^[a-z]+$/) || !inputValue) {
        throw { data: inputLine, code: "badInputFormat" }
      } else if (forbiddenVariables.indexOf(id) !== -1) {
        throw { data: id, code: 'forbiddenVariableName' }
      } else {
        const value = await expressionValue(inputValue)

        addToVariableList(id, value)

        return value
      }
    } else if (inputLine.match(/^[0-9+\-\.\/*%^()i]+$/)) {
      return await expressionValue(inputLine)
    } else {
      throw { data: inputLine, code: 'badInputFormat' }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
