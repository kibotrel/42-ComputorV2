class ComputorError extends Error {
  constructor({ code, data }) {
    super()

    this.name = 'ComputorError'
    this.code = code
    this.data = data
  }
}

module.exports = ComputorError