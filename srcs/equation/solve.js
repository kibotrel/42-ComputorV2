const parseEquation = require('@srcs/equation/parse.js')
const { printReducedEquation, printEquationType, printConstant, printLinear, printQuadratic } = require('@srcs/equation/print.js')
const { equationDegree } = require('@srcs/equation/utils.js')

const reduceEquation = (polynomList) => {
  let reducedList = []

  for (const polynom of polynomList) {
    const found = reducedList.find((element) => element.power === polynom.power)

    if (polynom.side === 'r' && polynom.factor !== 0) {
      polynom.sign *= -1
    }

    if (!found) {
      reducedList.push({ sign: polynom.sign, factor: polynom.factor, power: polynom.power })
    } else {
      found.factor = found.sign * found.factor + polynom.sign * polynom.factor
      found.sign = (found.factor >= 0 ? 1 : -1)
      found.factor = found.factor > 0 ? found.factor : -found.factor
    }
  }

  reducedList.sort((a, b) => a.power < b.power ? 1 : -1)

  for (const polynom of reducedList) {
    if (polynom.factor > -1 && polynom.factor < 1) {
      polynom.factor = parseFloat(polynom.factor.toFixed(Config.number.precision))
    }
  }

  return reducedList
}

module.exports = async (equation) => {
  try {
    const polynomList = await parseEquation(equation)
    const reducedList = reduceEquation(polynomList)
    const degree = equationDegree(reducedList)

    if (!Config.env.silentMode) {
      printReducedEquation(reducedList)
      printEquationType(degree)
    }

    let infos = {}

    if (degree <= 2) {
      const foundA = reducedList.filter((element) => {return element.power === 2})[0]
      const foundB = reducedList.filter((element) => {return element.power === 1})[0]
      const foundC = reducedList.filter((element) => {return element.power === 0})[0]

      const a = (foundA ? foundA.factor * foundA.sign : 0)
      const b = (foundB ? foundB.factor * foundB.sign : 0)
      const c = (foundC ? foundC.factor * foundC.sign : 0)

      switch (degree) {
        case 0: infos = printConstant(c); break
        case 1: infos = await printLinear(b, c); break
        case 2: infos = await printQuadratic(a, b, c); break
      }
    }

    Object.assign(infos, { degree })
    return { stack: reducedList, infos }

  } catch (error) {
    return Promise.reject(error)
  }
}
