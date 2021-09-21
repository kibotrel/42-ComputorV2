const HelpEntries = require('@configs//help.json')

module.exports = (argumentsList) => {
  try {
    if (argumentsList.length > 1) {
      throw new ComputorError({ data: { name: '!help', found: argumentsList.length, expected: 'at most 1' }, code: 'incorrectParameterAmount' })
    } else if (!argumentsList.length) {
      console.log('\n\x1b[1mThis program provide several details on some error codes. Here is the list of documented errors:\n')
      
      for (const help of HelpEntries) {
        console.log(`\t- \x1b[32m${help.code}\x1b[0;1m`)
      }

      console.log('\nFor more information on a particular code, use \'\x1b[32m!help <Error>\'\x1b[0;1m.\x1b[0m\n')
    } else {
      const [ code ] = argumentsList
      const data = HelpEntries.find(el => el.code.toLowerCase() === code)

      if (!data) {
        throw new ComputorError({ data: { command: `!help ${code}` }, code: 'unrecognizedCommand' })
      }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}