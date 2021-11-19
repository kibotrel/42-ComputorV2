const CommandEntries = require('@docs/commands.json')

const getType = (type) => {
  switch (type.toLowerCase()) {
    case 'string': return `\x1b[32m${type}\x1b[0;1m`
    case 'number': return `\x1b[33m${type}\x1b[0;1m`
    case 'boolean': return `\x1b[36m${type}\x1b[0;1m`
    default: return type
  }
}

const fillTemplate = (template, data) => {
    let output = template.replace(/{{\s?([^{}\s]+)\s?}}/g, (str, value) => {
      if (data[value].constructor.name === 'String') {
        return `\x1b[32m${data[value]}\x1b[0;1m`
      } else if (data[value].constructor.name === 'Number')
        return `\x1b[33m${data[value]}\x1b[0;1m`
    })

    // This if statement fixes a bug when some string data has a quote
    // inside itself. It would messes up display since the algorithm
    // checks for the next quote to close and style the found block.
    // Without this check it would recursively add more quotes and
    // repeat itself.

    const pairsArray = Object.entries(data || {})

    if (!pairsArray.filter(([ key, value ]) => value.includes('\'')).length) {
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
    }
  
    return `\x1b[1m${output}\x1b[0m`
  }

  module.exports = (argumentsList) => {
    try {
      if (argumentsList.length > 1) {
        throw new ComputorError({ data: { name: '!commands', found: argumentsList.length, expected: 'at most 1' }, code: 'incorrectParameterAmount' })
      } else if (!argumentsList.length) {
        console.log('\n\x1b[1mThis program has few commands you can use to interact with it. Here is the list of documented commands:\n')
        
        for (const command of CommandEntries) {
          console.log(`\t- \x1b[32m${command.code}\x1b[0;1m`)
        }
  
        console.log('\nFor more information on a particular command, use \'\x1b[32m!commands <Command>\x1b[0;1m\'. To use a particular command\nsimply type \'\x1b[32m!<Command> [optionnalParameter1 ... optionnalParameterN]\x1b[0;1m\'.\x1b[0m\n')
        return CommandEntries.map(entry => entry.code)
      } else {
        const [ code ] = argumentsList
        const entry = CommandEntries.find(el => el.code.toLowerCase() === code)
  
        if (!entry) {
          throw new ComputorError({ data: { command: `!commands ${code}` }, code: 'unrecognizedCommand' })
        } else {
          console.log(`\n\x1b[32;1m${entry.code}\x1b[0;1m:\n\n\tDescription:\n\n\t${fillTemplate(entry.message, entry.data)}\n\n\t\x1b[1mExample:\n\n\t\t'\x1b[32m${entry.usage}\x1b[0;1m'.\x1b[0m\n`)
        
          if (entry.params) {
            console.log('\t\x1b[1mPositional parameters:\n')

            let index = 0
            for (const param of entry.params) {
              console.log(`\t\t\x1b[33m${index}\x1b[0;1m. ${param.name}: ${getType(param.type)} | ${param.required ? 'Required' : 'Optionnal'}.`)
              index++
            }

            console.log('\x1b[0m\n')
          }
        }

        return entry
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
