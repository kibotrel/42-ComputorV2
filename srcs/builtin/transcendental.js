const { factorial } = require('@builtin/algebraic.js')

const { numeralValue } = require('@srcs/maths/compute.js')
const { toNumeral } = require('@srcs/maths/utils.js')


// Implementation of Taylor series that approximates
// functions through infinite expansion process.
// More info => https://bit.ly/2UeTaMT

const sin = async (arguments) => {
  try {
    if (arguments.length !== 1) {
      throw { data: { name: 'sin', arguments }, code: 'missingParameters' }
    }

    const [ rawInput ] = arguments
    
    let x

    if (rawInput.constructor.name === 'String') {
      x = await numeralValue(rawInput)
    } else {
      x = new Numeral(toNumeral(rawInput))
    }

    if (x.i === 0) {
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
    if (arguments.length !== 1) {
      throw { data: { name: 'cos', arguments }, code: 'missingParameters' }
    }

    const [ rawInput ] = arguments

    let x

    if (rawInput.constructor.name === 'String') {
      x = await numeralValue(rawInput)
    } else {
      x = new Numeral(toNumeral(rawInput))
    }

    if (x.i === 0) {
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
    if (arguments.length !== 1) {
      throw { data: { name: 'cosh', arguments }, code: 'missingParameters' }
    }

    const [ rawInput ] = arguments

    let x
    
    if (rawInput.constructor.name === 'String') {
      x = await numeralValue(rawInput)
    } else {
      x = new Numeral(toNumeral(rawInput))
    }

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
    if (arguments.length !== 1) {
      throw { data: { name: 'sinh', arguments }, code: 'missingParameters' }
    }

    const [ rawInput ] = arguments

    let x
    
    if (rawInput.constructor.name === 'String') {
      x = await numeralValue(rawInput)
    } else {
      x = new Numeral(toNumeral(rawInput))
    }

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

module.exports = { sin, cos, sinh, cosh }
