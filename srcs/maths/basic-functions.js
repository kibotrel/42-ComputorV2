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

const remainder = ({ a, b }) => {
  if (a < 0 === b < 0) {
    return a % b
  } else {
    a = Math.abs(a)

    let nextFactor = 0
    while(nextFactor < a) {
      nextFactor += b
    }

    return nextFactor - a
  }
}
module.exports = { leastCommonFactor, greatestCommonDivisor, remainder }
