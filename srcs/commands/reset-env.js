const fs = require('fs')

const showVariables = require('@commands/show-variables.js')

module.exports = async (argumentsList) => {
  try {
    if (argumentsList.length) {
      throw new ComputorError({ data: { name: '!reset', found: argumentsList.length, expected: 0 }, code: 'incorrectParameterAmount' })
    }

    const numNumerals = await showVariables([], 'Numeral', true).then( array => array.length)
    const numMatrices = await showVariables([], 'Matrix', true).then( array => array.length)
    const numExpressions = await showVariables([], 'Expression', true).then( array => array.length)
    const numInputs = InputHistory.length

    InputHistory.splice(0, InputHistory.length)
    Variables.splice(0, Variables.length)

    if (!Config.env.silentMode) {
      console.log('\n\x1b[1mContext configuration has been reset.\x1b[0m\n')

      if (numNumerals) {
        console.log(`\t- \x1b[33;1m${numNumerals}\x1b[0;1m \x1b[32mNumeral${numNumerals > 1 ? 's' : ''}\x1b[0;1m removed.\x1b[0m`)
      }

      if (numMatrices) {
        console.log(`\t- \x1b[33;1m${numMatrices}\x1b[0;1m \x1b[32m${numMatrices > 1 ? 'Matrices' : 'Matrix'}\x1b[0;1m removed.\x1b[0m`)
      }

      if (numExpressions) {
        console.log(`\t- \x1b[33;1m${numExpressions}\x1b[0;1m \x1b[32mExpression${numExpressions > 1 ? 's' : ''}\x1b[0;1m removed.\x1b[0m`)
      }

      if (numInputs) {
        console.log(`\t- \x1b[33;1m${numInputs}\x1b[0;1m registered input${numInputs > 1 ? 's' : ''} erased from history.\x1b[0m\n`)
      }
    }

    // Shity trick to avoid weird Javascript behaviour that does not
    // allow you to reset variable value to file content when already
    // modified during program context.

    Object.assign(Config, JSON.parse(fs.readFileSync('configs/env.json')))

    return { numNumerals, numMatrices, numExpressions, numInputs }
  } catch (error) {
    return Promise.reject(error)
  }
}
