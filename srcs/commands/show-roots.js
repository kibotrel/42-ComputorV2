const solveEquation = require('@srcs/equation/solve.js')
const plotEquation = require('@srcs/equation/plot.js')

const { Config: { equation: config } } = global

module.exports = async (input) => {
  try {
    const equation = await solveEquation(input)

    if (config.graph) {
      await plotEquation(equation)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}