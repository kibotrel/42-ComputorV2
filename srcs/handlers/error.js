const Errors = require('@configs/errors.json')

module.exports = (error) => {
  // if (error.code !== undefined) {
  //   console.log(`\x1b[31;1m[Error]:\x1b[0;1m ${error.code}\x1b[0m`)
  // } else {
    console.log(error)
  // }
}
