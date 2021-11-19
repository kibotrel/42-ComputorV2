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
    const argumentsList = commandParts.slice(1, commandParts.length)

    if (Config.env.commands.indexOf(commandName) < 0) {
      throw new ComputorError({ data: { command: commandParts.join(' ') }, code: 'unrecognizedCommand' })
    }

    let value

    switch (commandName) {
      case '!variables':
        value = await showVariables(argumentsList, 'Numeral'); break
      case '!matrices':
        value = await showVariables(argumentsList, 'Matrix'); break
      case '!functions':
        value = await showVariables(argumentsList, 'Expression'); break
      case '!solve':
        value = await showRoots(argumentsList); break
      case '!history':
        value = await showHistory(argumentsList); break
      case '!set':
        value = await updateSetting(argumentsList); break
      case '!config':
        value = await showConfig(argumentsList); break
      case '!help':
        value = await showHelp(argumentsList); break
      case '!commands':
        value = await showCommands(argumentsList); break
      case '!reset':
        value = await resetEnv(argumentsList); break
    }

    return { value, type: 'command' }
  } catch (error) {
    return Promise.reject(error)  
  }
}
