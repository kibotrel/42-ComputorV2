const { sanitizeArguments } = require('@builtin/utils.js')

const { toNumeral } = require('@srcs/maths/utils.js')

const abs = async (arguments) => {
  try {
    const { [0]: x } = await sanitizeArguments({ arguments, name: 'abs', amount: 1 })

    if (!x.i) {
      return x.r > 0 ? x : new Numeral(await toNumeral(-x.r))
    } else {
      return await sqrt([x.r * x.r + x.i * x.i])
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const radian = async (arguments) => {
  try {
    const { [0]: x } = await sanitizeArguments({ arguments, name: 'rad', amount: 1 })

    if (x.i) {
      throw new ComputorError({ code: 'builtinNotHandledOperator' })
    } else {
      x.r %= 360
    }
    
    // y = x * π / 180

    return new Numeral(await toNumeral(x.r * Math.PI / 180))
  } catch (error) {
    return Promise.reject(error)
  }
}

const degree = async (arguments) => {
  try {
    const { [0]: x } = await sanitizeArguments({ arguments, name: 'deg', amount: 1 })

    if (x.i) {
      throw new ComputorError({ code: 'builtinNotHandledOperator' })
    } else {
      x.r %= (Math.PI * 2)
    }
    
    // y = x * 180 / π

    return new Numeral(await toNumeral(x.r * 180 / Math.PI))
  } catch (error) {
    return Promise.reject(error)
  }
}

const factorial = async (arguments) => {
  try {
    const { [0]: x } = await sanitizeArguments({ arguments, name: 'fact', amount: 1 })

    // A potential good candidate to handle complex and decimal value
    // would be the Gamma function where factorial(x) = Gamma(x + 1).
    // More details => https://bit.ly/3hnuAml.

    if (x.r < 0 || x.i || !Number.isInteger(x.r)) {
      throw new ComputorError({ code: 'builtinNotHandledOperator' })
    }

    // y = 1 * 2 * ... * x

    if (x.r <= 1) {
      return new Numeral(await toNumeral(1))
    } else {
      let y = 2

      for (let i = 3; i <= x.r; i++) {
        y *= i
      }

      return new Numeral(await toNumeral(y))
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const sqrt = async (arguments) => {
  try {
    const { [0]: x } = await sanitizeArguments({ arguments, name: 'sqrt', amount: 1 })

    if (x.i) {
      throw new ComputorError({ code: 'builtinNotHandledOperator' })
    }

    let sign = 1

    if (x.r < 0) {
      x.r = -x.r
      x.nr = -x.nr
      sign = -1
    }

    let y = 1

    // By definition sqrt(x) must be greater than the one
    // of the last integer and lesser than the following one
    // so we compute the nearest perfect root of x to speed
    // up the process.

    for (let i = 1; i * i <= x.r; i++) {
      y = i
    }

    // Following the Babylonian algorithm (More infos => https://bit.ly/3AFLXGy)
    // itterate the following equation to get closer and closer to the actual
    // root of x: y = 0.5 * (y + x / y) starting with y as the closest perfect root.
  
    for (let i = 0; i < Config.function.expensionCount; i++) {
      y = await Numeral.multiply(0.5, await Numeral.add(y, await Numeral.divide(x, y)))
    }

    if (sign < 0) {
      return new Numeral({ r: 0, i: y.r, nr: 0, dr: 1, ni: y.nr, di: y.dr })
    } else {
      return new Numeral(await toNumeral(y))
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

// Implementation of Taylor series that approximates
// functions through infinite expansion process.
// More info => https://bit.ly/2UeTaMT.

const exp = async (arguments) => {
  try {
    const { [0]: x } = await sanitizeArguments({ arguments, name: 'exp', amount: 1 })

    let y = await Numeral.add(1, x)

    // y = 1 + x + x^2 / 2! + x^3 / 3! + ... + x^n / n!

    for (let n = 2; n < Config.function.expensionCount; n++) {
      y = await Numeral.add(y, await Numeral.divide(await Numeral.power(x, n), await factorial([n])))
    }

    return new Numeral(await toNumeral(y))
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { degree, radian, exp, sqrt, factorial, abs }
