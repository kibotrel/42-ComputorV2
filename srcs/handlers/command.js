const { env: { commands } } = Config

const showRoots = require('@commands/show-roots.js')
const showVariables = require('@commands/show-variables.js')
const showHistory = require('@commands/show-history.js')

module.exports = async (inputLine) => {
  try {
    const commandParts = inputLine.split(/\s+/)
    const commandName = commandParts[0]
    const commandArguments = commandParts.slice(1, commandParts.length)

    if (commands.indexOf(commandName) < 0) {
      throw { data: commandParts.join(' '), code: 'unrecognizedCommand' }
    }

    switch (commandName) {
      case '!variables':
        await showVariables(commandArguments, 'Numeral'); break
      case '!matrices':
        await showVariables(commandArguments, 'Matrix'); break
      case '!functions':
        await showVariables(commandArguments, 'Expression'); break
      case '!solve':
        await showRoots(commandArguments); break
      case '!history':
        await showHistory(commandArguments); break
    }

    return { value: commandName, type: 'command' }
  } catch (error) {
    return Promise.reject(error)  
  }
}
