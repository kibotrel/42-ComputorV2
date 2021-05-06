const { env: { commands } } = Config

const showRoots = require('@commands/show-roots.js')
const showVariables = require('@commands/show-variables.js')

module.exports = async (inputLine) => {
  try {
    for (const command of commands) {
      if (inputLine.startsWith(command)) {
        const commandArgument = inputLine.substring(command.length)

        switch (command) {
          case '!variables':
            return await showVariables(command,commandArgument, 'Numeral')
          case '!matrices':
            return await showVariables(command, commandArgument, 'Matrix')
          case '!functions':
            return await showVariables(command, commandArgument, 'Expression')
          case '!solve':
            return await showRoots(commandArgument)
        }
      }
    }
 
    throw { data: "", code: 'unrecognizedCommand' }
  } catch (error) {
    return Promise.reject(error)  
  }
}