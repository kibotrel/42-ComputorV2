const { env: { commands } } = Config

const showRoots = require('@commands/show-roots.js')
const showVariables = require('@commands/show-variables.js')
const showHistory = require('@commands/show-history.js')
const showConfig = require('@commands/show-config.js')
const updateSetting = require('@commands/update-setting.js')
const showHelp = require('@commands/show-help.js')
const showCommands = require('@commands/show-commands.js')
const resetEnv = require('@commands/reset-env.js')

module.exports = async (inputLine) => {
  try {
    const commandParts = inputLine.split(/\s+/)
    const commandName = commandParts[0]
    const commandArguments = commandParts.slice(1, commandParts.length)

    if (commands.indexOf(commandName) < 0) {
      throw new ComputorError({ data: { command: commandParts.join(' ') }, code: 'unrecognizedCommand' })
    }

    let value

    switch (commandName) {
      case '!variables':
        value = await showVariables(commandArguments, 'Numeral'); break
      case '!matrices':
        value = await showVariables(commandArguments, 'Matrix'); break
      case '!functions':
        value = await showVariables(commandArguments, 'Expression'); break
      case '!solve':
        value = await showRoots(commandArguments); break
      case '!history':
        value = await showHistory(commandArguments); break
      case '!set':
        value = await updateSetting(commandArguments); break
      case '!config':
        value = await showConfig(commandArguments); break
      case '!help':
        value = await showHelp(commandArguments); break
      case '!commands':
        value = await showCommands(commandArguments); break
      case '!reset':
        value = await resetEnv(commandArguments); break
    }

    return { value, type: 'command' }
  } catch (error) {
    return Promise.reject(error)  
  }
}
