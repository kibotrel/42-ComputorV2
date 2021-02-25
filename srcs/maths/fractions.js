const { leastCommonFactor, greatestCommonDivisor } = require('@srcs/maths/basic-functions.js')

const simplifyFraction = ({ numerator, denominator }) => {
  const commonDivisor = greatestCommonDivisor({ a: numerator, b: denominator })

  numerator = numerator / commonDivisor
  denominator = denominator / commonDivisor

  return { n: numerator, d: denominator }
}

const decimalToIntegerScaling = ({ number, shift }) => {
  // Quick fix for imprecision for some floating point values
  // by calculating the length of the truncated digits after
  // the dot in the string representation of the number

  let numberString = parseFloat(number.toPrecision(Config.floatPrecision)).toString()
  const floatIndex = numberString.indexOf('.')

  if (floatIndex >= 0) {
    numberString = numberString.substring(floatIndex + 1)

    const shiftAmount = numberString.length

    for (let i = 0; i < shiftAmount; i++) {
      number *= 10
    }

    // Once again a trick to correct precision error from javascript

    number = parseFloat(number.toPrecision(Config.floatPrecision))

    let scalingFactor = (!shiftAmount ? 1 : 10)

    for (let i = 1; i < shiftAmount; i++) {
      scalingFactor *= 10
    }
    return { n: number, d: scalingFactor }
  }

  return { n: number, d: shift === undefined ? 1 : shift }
}

const addFraction = (a , b, sign) => {
  // Need to know and remove the sign of each fraction to beforehand to simplify
  // computation and put back the correct one at the end of the process.

  const signA = (a.n >= 0 ? 1 : -1) * (a.d >= 0 ? 1 : -1)
  const signB = (b.n >= 0 ? 1 : -1) * (b.d >= 0 ? 1 : -1)

  a.n *= (a.n < 0 ? -1 : 1)
  a.d *= (a.d < 0 ? -1 : 1)
  b.n *= (b.n < 0 ? -1 : 1)
  b.d *= (b.d < 0 ? -1 : 1)

  const denominator = leastCommonFactor({ a: a.d, b: b.d })

  a.n = (denominator === a.d ? signA * a.n : signA * (denominator / a.d) * a.n)
  b.n = (denominator === b.d ? signB * b.n : signB * (denominator / b.d) * b.n)

  const numerator = (sign === '+' ? a.n + b.n : a.n - b.n)

  return simplifyFraction({ numerator, denominator })
}

const multiplyFraction = (a, b) => {
  return simplifyFraction({ numerator: a.n * b.n, denominator: a.d * b.d })
}
module.exports = { decimalToIntegerScaling, addFraction, multiplyFraction }
