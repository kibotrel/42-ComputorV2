const parseEquation = require('@srcs/equation/parse.js')
const { printReducedEquation } = require('@srcs/equation/print.js')

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
      found.factor = Math.abs(found.factor)
    }
  }

  reducedList.sort((a, b) => a.power < b.power ? 1 : -1)

  return reducedList
}

module.exports = async (equation) => {
  try {
    const polynomList = await parseEquation(equation)
    const reducedList = reduceEquation(polynomList)

    printReducedEquation(reducedList)
  } catch (error) {
    return Promise.reject(error)
  }
}