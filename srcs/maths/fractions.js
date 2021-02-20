const { leastCommonFactor, greatestCommonDivisor } = require('@srcs/maths/basic-functions.js')

const decimalToIntegerScaling = ({ number, shift }) => {
  // Quick fix for imprecision for some floating point values
  // by calculating the length of the truncated digits after
  // the dot in the string representation of the number

  let numberString = parseFloat(number.toPrecision(15)).toString()
  const floatIndex = numberString.indexOf('.')

  if (floatIndex >= 0) {
    numberString = numberString.substring(floatIndex + 1)

    const shiftAmount = numberString.length

    for (let i = 0; i < shiftAmount; i++) {
      number *= 10
    }

    // Once again a trick to correct precision error from javascript

    number = parseFloat(number.toPrecision(15))

    let scalingFactor = (!shiftAmount ? 1 : 10)

    for (let i = 1; i < shiftAmount; i++) {
      scalingFactor *= 10
    }
    return { n: number, d: scalingFactor }
  }

  return { n: number, d: shift === undefined ? 1 : shift }
}

const addFraction = (a , b) => {
  // Need to know and remove the sign of each fraction to beforehand to simplify
  // computation and put back the correct one at the end of the process.

  const signA = (a.n >= 0 ? 1 : -1) * (a.d >= 0 ? 1 : -1)
  const signB = (b.n >= 0 ? 1 : -1) * (b.d >= 0 ? 1 : -1)

  a.n *= (a.n < 0 ? -1 : 1)
  a.d *= (a.d < 0 ? -1 : 1)
  b.n *= (b.n < 0 ? -1 : 1)
  b.d *= (b.d < 0 ? -1 : 1)

  const commonFactor = leastCommonFactor({ a: a.d, b: b.d })

  a.n = (commonFactor === a.d ? signA * a.n : signA * (commonFactor / a.d) * a.n)
  b.n = (commonFactor === b.d ? signB * b.n : signB * (commonFactor / b.d) * b.n)

  const commonDivisor = greatestCommonDivisor({ a: a.n + b.n, b: commonFactor })
  const numerator = (a.n + b.n) / commonDivisor
  const denominator = commonFactor / commonDivisor

  return { numerator, denominator }
}

module.exports = { decimalToIntegerScaling, addFraction }
