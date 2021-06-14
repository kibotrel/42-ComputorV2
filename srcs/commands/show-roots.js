const plotEquation = require('@srcs/equation/plot.js')
const solveEquation = require('@srcs/equation/solve.js')

module.exports = async (argumentsList) => {
  try {
    const input = argumentsList[0]

    if (argumentsList.length != 1) {
      throw { data: argumentsList.join(' '), code: 'invalidArgument' }
    }

    const equation = await solveEquation(input)

    if (Config.equation.graph) {
      await plotEquation(equation)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}