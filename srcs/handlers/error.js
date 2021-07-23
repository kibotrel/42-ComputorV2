const Errors = require('@configs/errors.json')

module.exports = (error) => {
  const { code, data } = error

  if (error.constructor.name === 'ComputorError') {
    console.log({ code, data })

    if (Config.env.errorStackTrace) {
      console.log(error.stack)
    }
  } else {
    console.log(error)
  }
}
