const { numeralValue } = require('@srcs/maths/compute.js')
const { factorial } = require('@srcs/maths/advanced-functions.js')

const { toNumeral } = require('@srcs/maths/utils.js')

const rad = (angle) => {
  return angle * Math.PI / 180
}

const deg = (angle) => {
  return angle * 180 / Math.PI
}

// Implementation of Taylor series that approximates
// functions through infinite expansion process.
// More info => https://bit.ly/2UeTaMT

// number %= (Math.PI * 2)

const sin = async (arguments) => {
  try {
    if (arguments.length !== 1) {
      throw { data: { name: 'sin', arguments }, code: 'missingParameters' }
    }

    const [ rawInput ] = arguments
    const number = await numeralValue(rawInput)

    let value = number
    
    for (let x = 1; x < Config.function.expensionCount; x++) {
      const power = await Numeral.power(number, x * 2 + 1)
      const division = await Numeral.divide(power, factorial(x * 2 + 1))

      if (x % 2) {
        value = await Numeral.substract(value, division)
      } else {
        value = await Numeral.add(value, division)
      }
    }

    return new Numeral(toNumeral(value))
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
    const number = await numeralValue(rawInput)

    let value = 1
    
    for (let x = 1; x < Config.function.expensionCount; x++) {
      const power = await Numeral.power(number, x * 2)
      const division = await Numeral.divide(power, factorial(x * 2))

      if (x % 2) {
        value = await Numeral.substract(value, division)
      } else {
        value = await Numeral.add(value, division)
      }
    }

    return new Numeral(toNumeral(value))
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { sin, cos, deg, rad }
