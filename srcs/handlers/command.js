const { env: { commands } } = Config

module.exports = async (inputLine) => {
  try {
    for (const command of commands) {
      if (inputLine.startsWith(command)) {
        const commandArgument = inputLine.substring(command.length)

        // Insert here command trigger switch case

        return
      }
    }
    throw { data: "", code: 'unrecognizedCommand' }
  } catch (error) {
    return Promise.reject(error)
  }
}