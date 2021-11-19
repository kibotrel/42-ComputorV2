const HelpEntries = require('@docs/help.json')

const fillTemplate = (template, data) => {
  let output = template.replace(/{{\s?([^{}\s]+)\s?}}/g, (str, value) => {

    if (data[value].constructor.name === 'String') {
      return `\x1b[32m${data[value]}\x1b[0;1m`
    } else if (data[value].constructor.name === 'Number')
      return `\x1b[33m${data[value]}\x1b[0;1m`
  })

  for(let i = 0; i < output.length; i++) {
    if (output[i] === '\'') {
      const closure = output.indexOf('\'', i + 1)
      let data = output.substring(i + 1, closure)
      const oldDataLength = data.length

      data = `\x1b[32m${data}\x1b[0;1m`

      const offset = data.length - oldDataLength
      
      output = `${output.substring(0, i)}'${data}'${output.substring(closure + 1, output.length)}`
      i = closure + offset
    }
  }
  return `\x1b[1m${output}\x1b[0m`
}

module.exports = (argumentsList) => {
  try {
    if (argumentsList.length > 1) {
      throw new ComputorError({ data: { name: '!help', found: argumentsList.length, expected: 'at most 1' }, code: 'incorrectParameterAmount' })
    } else if (!argumentsList.length) {
      console.log('\n\x1b[1mThis program provides several details on some error codes. Here is the list of documented errors:\n')
      
      for (const help of HelpEntries) {
        console.log(`\t- \x1b[32m${help.code}\x1b[0;1m`)
      }

      console.log('\nFor more information on a particular code, use \'\x1b[32m!help <Error>\x1b[0;1m\'. You also have access to a bunch\nof commands to help you use the software. Type \'\x1b[32m!commands\x1b[0;1m\' to see them.\x1b[0m\n')

      return HelpEntries.map(entry => entry.code)
    } else {
      const [ code ] = argumentsList
      const entry = HelpEntries.find(el => el.code.toLowerCase() === code)

      if (!entry) {
        throw new ComputorError({ data: { command: `!help ${code}` }, code: 'unrecognizedCommand' })
      } else {
        console.log(`\n\x1b[31;1m${entry.code}\x1b[0m:\n\n${fillTemplate(entry.message, entry.data)}`)
      }
      
      return entry
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
