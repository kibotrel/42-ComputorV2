const Errors = require('@docs/errors.json')

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

  if (!pairsArray.filter(([ key, value ]) => value.toString().includes('\'')).length) {
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

class ComputorError extends Error {
  constructor({ code, data }) {
    super()

    this.name = 'ComputorError'
    this.code = code
    this.data = data
  }

  print() {
    const { message } = Errors.find(error => { return error.code === this.code })
    const details = fillTemplate(message, this.data)

    console.log(`\n\x1b[31;1mError:\x1b[0;1m ${this.code}\x1b[0m\n\n${details}\n`)
  }
}

module.exports = ComputorError
