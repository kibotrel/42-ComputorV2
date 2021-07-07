const { factorial } = require('@builtin/algebraic.js')
const { sanitizeArguments } = require('@builtin/utils.js')

const { toNumeral } = require('@srcs/maths/utils.js')


// Implementation of Taylor series that approximates
// functions through infinite expansion process.
// More info => https://bit.ly/2UeTaMT

const sin = async (arguments) => {
  try {
    const { [0]: x } = await sanitizeArguments({ arguments, name: 'sin', amount: 1 })

    if (!x.i) {
      x.r %= (Math.PI * 2)
    }
    
    let y = x

    // y = x - (x^3 / 3!) + (x^5 / 5!) - (x^7 / 7!) ... + (-1)^n * x^(2n + 1) / (2n + 1)!

    for (let n = 1; n < Config.function.expensionCount; n++) {
      const nextTerm = await Numeral.divide(await Numeral.power(x, n * 2 + 1), await factorial([n * 2 + 1]))

      if (n % 2) {
        y = await Numeral.substract(y, nextTerm)
      } else {
        y = await Numeral.add(y, nextTerm)
      }
    }

    return new Numeral(toNumeral(y))
  } catch (error) {
    return Promise.reject(error)
  }
}

const cos = async (arguments) => {
  try {
    const { [0]: x } = await sanitizeArguments({ arguments, name: 'cos', amount: 1 })

    if (!x.i) {
      x.r %= (Math.PI * 2)
    }

    let y = 1

    // y = 1 - (x^2 / 2!) + (x^4 / 4!) - (x^6 / 6!) ... + (-1)^n * x^2n / 2n!

    for (let n = 1; n < Config.function.expensionCount; n++) {
      const nextTerm = await Numeral.divide(await Numeral.power(x, n * 2), await factorial([n * 2]))

      if (n % 2) {
        y = await Numeral.substract(y, nextTerm)
      } else {
        y = await Numeral.add(y, nextTerm)
      }
    }

    return new Numeral(toNumeral(y))
  } catch (error) {
    return Promise.reject(error)
  }
}

const cosh = async (arguments) => {
  try {
    const { [0]: x } = await sanitizeArguments({ arguments, name: 'cosh', amount: 1 })

    let y = 1

    // y = 1 + (x^2 / 2!) + (x^4 / 4!) + ... + x^2n / 2n!

    for (let n = 1; n < Config.function.expensionCount; n++) {
      y = await Numeral.add(y, await Numeral.divide(await Numeral.power(x, n * 2), await factorial([n * 2])))
    }

    return new Numeral(toNumeral(y))
  } catch (error) {
    return Promise.reject(error)
  }
}

const sinh = async (arguments) => {
  try {
    const { [0]: x } = await sanitizeArguments({ arguments, name: 'sinh', amount: 1 })

    let y = x

    // y = x + (x^3 / 3!) + (x^5 / 5!) + ... + x^(2n + 1) / (2n + 1)!

    for (let n = 1; n < Config.function.expensionCount; n++) {
      y = await Numeral.add(y, await Numeral.divide(await Numeral.power(x, n * 2 + 1), await factorial([n * 2 + 1])))
    }

    return new Numeral(toNumeral(y))
  } catch (error) {
    return Promise.reject(error)
  }
}

const ln = async (arguments) => {
  try {
    const { [0]: x } = await sanitizeArguments({ arguments, name: 'ln', amount: 1 })

    if (x.i || x.r < 0) {
      throw { data: x, code: 'builtinNotHandledOperation' }
    }

    const ratio = await Numeral.divide(await Numeral.substract(x, 1), await Numeral.add(x, 1))
    
    let y = ratio

    // y = 2 * ((x - 1) / (x + 1) + 1/3 * ((x - 1) / (x + 1))^3 + ... + 1 / (2n + 1) * ((x - 1) / (x + 1))^(2n + 1))

    for (let n = 1; n < Config.function.expensionCount; n++) {
      y = await Numeral.add(y, await Numeral.multiply(await Numeral.divide(1, n * 2 + 1), await Numeral.power(ratio, 2 * n + 1)))
    }

    return await Numeral.multiply(2, y)
  } catch (error) {
    return Promise.reject(error)
  }
}

// Implementing long division algorithm explained
// here => https://bit.ly/3jRzpWD to get the n first
// digits of the approximated function.

const log = async (arguments) => {
  try {
    const { [0]: x } = await sanitizeArguments({ arguments, name: 'log', amount: 1 })

    if (x.i || x.r < 0) {
      throw { data: x, code: 'builtinNotHandledOperation' }
    }

    let tmp = x
    let divCount = 0

    while (tmp.r > 10) {
      tmp = await Numeral.divide(tmp, 10)
      divCount++
    }

    let y = `${divCount.toString()}.`

    for (let i = 0; i < Config.function.expensionCount; i++) {
      tmp = await Numeral.power(tmp, 10)

      let divCount = 0

      while (tmp.r > 10) {
        tmp = await Numeral.divide(tmp, 10)
        divCount++
      }

      y += divCount.toString()
    }

    return new Numeral(toNumeral(parseFloat(y)))
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { sin, cos, sinh, cosh, ln, log }
