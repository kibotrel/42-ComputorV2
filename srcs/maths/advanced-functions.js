const { Config } = global

const { pow } = require('@srcs/maths/basic-functions.js')

const rad = (angle) => {
  return angle * Math.PI / 180
}

const deg = (angle) => {
  return angle * 180 / Math.PI
}

const factorial = (number) => {
  if (number < 2) {
    return 1
  } else {
    let result = number

    while (number > 1) {
      number--
      result *= number
    }

    return result
  }
}

// Implementation of the Babylonian algorithm to
// approximate square root of any positive real
// number. More infos => https://bit.ly/2SE1OUI

const sqrt = (number) => {
	let closestRoot = 1
  
  for (let i = 1; i * i <= number; i++) {
  	closestRoot = i
  }
  
  let approximatedRoot = closestRoot
  
  for (let i = 0; i < Config.function.expensionCount; i++) {
  	approximatedRoot = 0.5 * (approximatedRoot + number / approximatedRoot)
  }

	return approximatedRoot
}

// Implementation of Taylor series that approximates
// functions through infinite expansion process.
// More info => https://bit.ly/2UeTaMT

const sin = (number) => {
  // Clamp value within the unit circle since this function
  // is periodic between -1rad and 1 rad. (1rad = 2 * PI)

  number %= (Math.PI * 2)

  let approximation = number

  for (let i = 1; i < Config.function.expensionCount; i++) {
    if (i % 2) {
      approximation -= (pow(number, 2 * i + 1) / factorial(2 * i + 1))
    } else {
      approximation += (pow(number, 2 * i + 1) / factorial(2 * i + 1))
    }
  }

  return approximation
}

const cos = (number) => {
  number %= (Math.PI * 2)

  let approximation = 1

  for (let i = 1; i < Config.function.expensionCount; i++) {
    if (i % 2) {
      approximation -= (pow(number, 2 * i) / factorial(2 * i))
    } else {
      approximation += (pow(number, 2 * i) / factorial(2 * i))
    }
  }

  return approximation
}

const exp = (number) => {
  let approximation = 1 + number

  for (let i = 2; i < Config.function.expensionCount; i++) {
    approximation += (pow(number, i) / factorial(i))
  }

  return approximation
}
module.exports = { sqrt, factorial, sin, cos, exp, rad, deg }
