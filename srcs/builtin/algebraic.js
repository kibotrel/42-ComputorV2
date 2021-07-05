const { numeralValue } = require('@srcs/maths/compute.js')
const { toNumeral } = require('@srcs/maths/utils.js')

const radian = async (arguments) => {
  try {
    if (arguments.length !== 1) {
      throw { data: { name: 'rad', arguments }, code: 'missingParameters' }
    }

    const [ rawInput ] = arguments

    let x

    if (rawInput.constructor.name === 'String') {
      x = await numeralValue(rawInput)
    } else {
      x = new Numeral(toNumeral(rawInput))
    }

    if (x.i !== 0) {
      throw { data: x, code: 'builtinNotHandledOperation' }
    } else if (x.i === 0) {
      x.r %= (Math.PI * 2)
    }
    
    // y = x * π / 180

    return new Numeral(toNumeral(x.r * Math.PI / 180))
  } catch (error) {
    return Promise.reject(error)
  }
}

const degree = async (arguments) => {
  try {
    if (arguments.length !== 1) {
      throw { data: { name: 'deg', arguments }, code: 'missingParameters' }
    }

    const [ rawInput ] = arguments

    let x

    if (rawInput.constructor.name === 'String') {
      x = await numeralValue(rawInput)
    } else {
      x = new Numeral(toNumeral(rawInput))
    }

    if (x.i !== 0) {
      throw { data: x, code: 'builtinNotHandledOperation' }
    } else if (x.i === 0) {
      x.r %= (Math.PI * 2)
    }
    
    // y = x * 180 / π 

    return new Numeral(toNumeral(x.r * 180 / Math.PI))
  } catch (error) {
    return Promise.reject(error)
  }
}

const factorial = async (arguments) => {
  try {
    if (arguments.length !== 1) {
      throw { data: { name: 'fact', arguments }, code: 'missingParameters' }
    }

    const [ rawInput ] = arguments

    let x

    if (rawInput.constructor.name === 'String') {
      x = await numeralValue(rawInput)
    } else {
      x = new Numeral(toNumeral(rawInput))
    }

    // A potential good candidate to handle complex and decimal value
    // would be the Gamma function where factorial(x) = Gamma(x + 1).
    // More details => https://bit.ly/3hnuAml

    if (x.r < 0 || x.i || !Number.isInteger(x.r)) {
      throw { data: x, code: 'builtinNotHandledOperation' }
    }

    // y = 1 * 2 * ... * x

    if (x.r <= 1) {
      return new Numeral(toNumeral(1))
    } else {
      let y = 2

      for (let i = 3; i <= x.r; i++) {
        y *= i
      }

      return new Numeral(toNumeral(y))
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

// Implementation of Taylor series that approximates
// functions through infinite expansion process.
// More info => https://bit.ly/2UeTaMT

const exp = async (arguments) => {
  try {
    if (arguments.length !== 1) {
      throw { data: { name: 'exp', arguments }, code: 'missingParameters' }
    }

    const [ rawInput ] = arguments

    let x

    if (rawInput.constructor.name === 'String') {
      x = await numeralValue(rawInput)
    } else {
      x = new Numeral(toNumeral(rawInput))
    }

    let y = await Numeral.add(1, x)

    // y = 1 + x + x^2 / 2! + x^3 / 3! + ... + x^n / n!

    for (let n = 2; n < Config.function.expensionCount; n++) {
      y = await Numeral.add(y, await Numeral.divide(await Numeral.power(x, n), await factorial([n])))
    }

    return new Numeral(toNumeral(y))
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { degree, radian, exp, factorial }
