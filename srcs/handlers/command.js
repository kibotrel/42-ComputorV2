const { env: { commands } } = Config

const showRoots = require('@commands/show-roots.js')
const showVariables = require('@commands/show-variables.js')

module.exports = async (inputLine) => {
  try {
    let executedCommand = null

    for (const command of commands) {
      if (inputLine.startsWith(command)) {
        const commandArgument = inputLine.substring(command.length)

        executedCommand = command

        switch (command) {
          case '!variables':
            await showVariables(command,commandArgument, 'Numeral'); break
          case '!matrices':
            await showVariables(command, commandArgument, 'Matrix'); break
          case '!functions':
            await showVariables(command, commandArgument, 'Expression'); break
          case '!solve':
            await showRoots(commandArgument); break
        }
      }
    }

    if (!executedCommand) {
      throw { data: inputLine, code: 'unrecognizedCommand' }
    }

    return { value: executedCommand, type: 'command' }
  } catch (error) {
    return Promise.reject(error)  
  }
}