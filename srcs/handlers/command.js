const { env: { commands } } = Config
const showVariables = require('@commands/show-variables.js')

module.exports = async (inputLine) => {
  try {
    for (const command of commands) {
      if (inputLine.startsWith(command)) {
        const commandArgument = inputLine.substring(command.length)

        switch (command) {
          case '!variables':
            await showVariables(command,commandArgument, 'Numeral'); break
          case '!matrices':
            await showVariables(command, commandArgument, 'Matrix'); break
          case 'functions':
            await showVariables(command, commandArgument, 'Expression'); break
          default:
            break
        }

        return
      }
    }
    throw { data: "", code: 'unrecognizedCommand' }
  } catch (error) {
    return Promise.reject(error)  
  }
}