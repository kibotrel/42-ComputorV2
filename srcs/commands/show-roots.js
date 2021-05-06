const plotEquation = require('@srcs/equation/plot.js')
const solveEquation = require('@srcs/equation/solve.js')

module.exports = async (input) => {
  try {
    const equation = await solveEquation(input)

    if (Config.equation.graph) {
      await plotEquation(equation)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}