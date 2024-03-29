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
    dividend = dividend > 0 ? dividend : -dividend

    let nextFactor = 0
    while(nextFactor < dividend) {
      nextFactor += divisor
    }

    return nextFactor - dividend
  }
}

const floor = (number) => {
	if (Number.isInteger(number)) {
  	return number
  } else {
  	const flooredValue = parseInt(number)
    
    return flooredValue - (number < 0 ? 1 : 0)
  }
}

module.exports = { leastCommonFactor, greatestCommonDivisor, remainder, floor }
