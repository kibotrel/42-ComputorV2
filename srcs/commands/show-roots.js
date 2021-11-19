const plotEquation = require('@srcs/equation/plot.js')
const solveEquation = require('@srcs/equation/solve.js')

const isEquationToken = (token) => {
  return token.match(/^([+\-]?\d+(\.\d+)?|[+\-]?x(\^\d+)?|[+\-]?\d+(\.\d+)?\*?x(\^\d+)?|[=+\-])+$/)
}

const parseArguments = async (argumentsList) => {
  try {
    const params = []

    for (const argument of argumentsList) {
      if (isEquationToken(argument)) {
        params.push(argument)
      } else {
        throw new ComputorError({ data: { equation: argumentsList.join(' ') }, code: 'notEquation' })
      }
    }
    
    return params.join('')
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = async (argumentsList) => {
  try {
    const params = await parseArguments(argumentsList)
    const equation = await solveEquation(params)

    if (Config.equation.graph) {
      await plotEquation(equation)
    }
    return equation
  } catch (error) {
    return Promise.reject(error)
  }
}
