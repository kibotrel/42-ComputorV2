const Errors = require('@configs/errors.json')

module.exports = (error) => {
  if (error.code !== undefined) {
    console.log(`\x1b[31;1m[Error]:\x1b[0;1m ${error.code}\x1b[0m`)
    if (error.data) {
      console.log(error.data)
    if (error.index) {
      console.log(`At index: ${error.index}`)
    }
    }
  } else {
    console.log(error)
  }
}
