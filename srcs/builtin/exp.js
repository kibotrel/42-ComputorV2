const { numeralValue } = require('@srcs/maths/compute.js')
const { factorial } = require('@srcs/maths/advanced-functions.js')

const { toNumeral } = require('@srcs/maths/utils.js')

module.exports = async (arguments) => {
  try {
    if (arguments.length !== 1) {
      throw { data: { name: 'exp', arguments }, code: 'missingParameters' }
    }

    const [ rawInput ] = arguments
    const number = await numeralValue(rawInput)

    let value = await Numeral.add(1, number)

    for (let x = 2; x < Config.function.expensionCount; x++) {
      const power = await Numeral.power(number, x)
      const division = await Numeral.divide(power, factorial(x))

      value = await Numeral.add(value, division)
    }

    return new Numeral(toNumeral(value))
  } catch (error) {
    return Promise.reject(error)
  }
}
