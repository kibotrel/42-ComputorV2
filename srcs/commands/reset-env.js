const fs = require('fs')

const showVariables = require('@commands/show-variables.js')

module.exports = async (argumentsList) => {
  try {
    if (argumentsList.length) {
      throw new ComputorError({ data: { name: '!reset', found: argumentsList.length, expected: 0 }, code: 'incorrectParameterAmount' })
    }

    const numNumerals = await showVariables([], 'Numeral').length || 0
    const numMatrices = await showVariables([], 'Matrix').length || 0
    const numExpressions = await showVariables([], 'Expression').length || 0
    const numInputs = InputHistory.length

    InputHistory = []
    Variables = []

    // Shity trick to avoid weird Javascript behaviour that does not
    // allow you to reset variable value to file content when already
    // modified during program context.

    Config = new Object(JSON.parse(fs.readFileSync('configs/env.json')))

    return { numNumerals, numMatrices, numExpressions, numInputs }
  } catch (error) {
    return Promise.reject(error)
  }
}
