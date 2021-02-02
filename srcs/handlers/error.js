const Errors = require('@configs/errors.json')

module.exports = (error) => {
  if (error.code !== undefined && error.index !== undefined) {
    console.log(`Error: ${error.code} at index: ${error.index}`)
  } else {
    console.log(error)
  }
}
