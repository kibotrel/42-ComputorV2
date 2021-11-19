const { countDigits, fillDigits } = require('@env/utils.js')

module.exports = (argumentsList) => {
  try {
    if (argumentsList.length) {
      throw new ComputorError({ data: { name: '!history', found: argumentsList.length, expected: 0 }, code: 'incorrectParameterAmount' })
    }

    const promptedHistory = []
    const startIndex = Config.env.historySize > 0 ? Math.max(0, InputHistory.length - Config.env.historySize) : 0
    const indexSize = countDigits(InputHistory.length - 1)

    for (let i = startIndex; i < InputHistory.length; i++) {
      promptedHistory.push(`\t\x1b[33;1m${fillDigits(i, indexSize)}\x1b[32;1m: ${InputHistory[i]}\x1b[0m`)
    }

    if (!Config.env.silentMode) {
      console.log(`\n\x1b[1mRegistered \x1b[33;1m${InputHistory.length}\x1b[0;1m inputs !\x1b[0m\n\n${promptedHistory.join('\n')}`)
    }

    return InputHistory
  } catch (error) {
    return Promise.reject(error)
  }
}
