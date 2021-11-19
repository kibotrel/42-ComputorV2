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
      console.log('- Context configuration has been reset.')

      if (numNumerals) {
        console.log(`- ${numNumerals} Numeral element(s) removed.`)
      }

      if (numMatrices) {
        console.log(`- ${numMatrices} Matrix element(s) removed.`)
      }

      if (numExpressions) {
        console.log(`- ${numExpressions} Expression element(s) removed.`)
      }

      if (numInputs) {
        console.log(`- ${numInputs} registered input(s) erased from history.`)
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
