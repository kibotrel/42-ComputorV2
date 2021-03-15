const { decimalToIntegerScaling, simplifyFraction } = require('@srcs/maths/fractions.js')

const checkNumeral = async (numeral, operator) => {
  try {
    if (numeral === undefined) {
      throw { data: operator, code: 'invalidOperation' }
    } else {
      for (const property in numeral) {
        if (numeral[property] === Number.NEGATIVE_INFINITY || numeral[property] === Number.POSITIVE_INFINITY) {
          throw { data: { numeral, faultyProperty: property }, code: 'tooBigNumber' }
        } else if (Number.isNaN(numeral[property])) {
          throw { data: { numeral, faultyProperty: property }, code: 'notNumber' }
        }
      }
    }

    return numeral
  } catch (error) {
    return Promise.reject(error)
  }
}

const toNumeral = async (value) => {
  try {
    if (value.constructor.name === 'Numeral') {
      return value
    } else if (value.constructor.name === 'Number') {
      const { n: numerator, d: denominator } = decimalToIntegerScaling({ number: value })
      const { n: nr, d: dr } = simplifyFraction({ numerator, denominator })

      return { r: value, i: 0, nr, dr, ni: 0, di: 1 }
    } else {
      const { r, i , nr, dr, ni, di } = value

      return { r, i, nr, dr, ni, di }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const numeralFractionalParts = (numeral) => {
  const re = { n: numeral.nr, d: numeral.dr }
  const im = { n: numeral.ni, d: numeral.di }

  return { re, im }
}

module.exports = { checkNumeral, toNumeral, numeralFractionalParts }
