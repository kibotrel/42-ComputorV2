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

const remainder = ({ dividend, divisor }) => {
  if (dividend < 0 === divisor < 0) {
    return dividend % divisor
  } else {
    dividend = abs(dividend)

    let nextFactor = 0
    while(nextFactor < dividend) {
      nextFactor += divisor
    }

    return nextFactor - dividend
  }
}

const pow = (number, exponent) => {
  if ((number === 0 && exponent === 0) || number === 1 || exponent === 0) {
    return 1
  } else if (number === 0) {
    return 0
  } else if (exponent < 0) {
    return 1 / pow(number, abs(number))
  }
  return number * pow(number, exponent - 1)
}

const abs = (a) => {
  return a > 0 ? a : -a
}

const floor = (number) => {
	if (Number.isInteger(numberString)) {
  	return number
  } else {
  	const flooredValue = parseInt(number)
    
    return flooredValue - (number < 0 ? 1 : 0)
  }
}

module.exports = { leastCommonFactor, greatestCommonDivisor, remainder, abs, pow, floor }
