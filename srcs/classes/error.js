const Errors = require('@configs/errors.json')

const fillTemplate = (template, data) => {
  let output = template.replace(/{{\s?([^{}\s]+)\s?}}/g, (str, value, i) => {

    if (data[value].constructor.name === 'String') {
      return `\x1b[32m${data[value]}\x1b[0;1m`
    } else if (data[value].constructor.name === 'Number')
      return `\x1b[33m${data[value]}\x1b[0;1m`
  })

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

    console.log(`\x1b[31;1mError:\x1b[0;1m ${this.code}\x1b[0m\n\n${details}`)
  }
}

module.exports = ComputorError
