module.exports = (error) => {
  if (error.constructor.name === 'ComputorError') {
    error.print()

    if (Config.env.errorStackTrace) {
      console.log(error.stack)
    }
  } else {
    console.log(error)
  }
}
