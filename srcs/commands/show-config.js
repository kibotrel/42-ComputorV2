const { Config } = global

module.exports = (argumentsList) => {
  try {
    if (argumentsList.length) {
      throw { data: argumentsList.join(' '), code: 'invalidArgument' }
    }

    console.log(`\x1b[1mCurrent context's\x1b[32mSettings\x1b[0;1m!\x1b[0m\n`)

    for (const section of Object.keys(Config)) {
      console.log(`\t\x1b[32;1m${section[0].toLocaleUpperCase() + section.substring(1)}\x1b[0;1m:\x1b[0m\n`)
      
      for (const property of Object.keys(Config[section])) {
        const dataType = typeof Config[section][property]

        if (dataType != 'object') {
          console.log(`\t\t\x1b[32;1m${property}\x1b[0;1m: ${dataType === 'number' ? '\x1b[33m' : '\x1b[36m'}${Config[section][property]}\x1b[0m`)
        }
      }

      console.log('')
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
