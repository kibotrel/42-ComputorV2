const { Config } = global

const { pow } = require('@srcs/maths/basic-functions.js')

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

module.exports = { sqrt, factorial }
