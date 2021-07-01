const { Config } = global

const squareRoot = (number) => {
	let closestRoot = 1
  
  for(let i = 1; i * i <= number; i++) {
  	closestRoot = i
  }
  
  let approximatedRoot = closestRoot
  
  for(let i = 0; i < Config.function.expensionCount; i++) {
  	approximatedRoot = 0.5 * (approximatedRoot + number / approximatedRoot)
  }

	return approximatedRoot
}

module.exports = { squareRoot }