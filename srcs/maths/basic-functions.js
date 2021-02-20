const leastCommonFactor = ({ a, b }) => {
  const commonDivisor = greatestCommonDivisor({ a, b })

  return (a * b) / commonDivisor
}

const greatestCommonDivisor = ({ a, b }) => {
  let tmp

  while (b !== 0) {
    tmp = b
    b = a % b
    a = tmp
  }

  return a
}

module.exports = { leastCommonFactor, greatestCommonDivisor }
