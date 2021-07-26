const { cos, sin, cosh, sinh, ln, log } = require('@builtin/transcendental.js')
const { degree, radian, exp, factorial, sqrt, abs } = require('@builtin/algebraic.js')

module.exports = async (input) => {
  try {
    const sign = input[0] === '-' ? -1 : 1
    const func = input.replace(/^[+\-]/, '')
    const name = func.substring(0, func.indexOf('('))
    const arguments = func.substring(func.indexOf('(') + 1, func.lastIndexOf(')')).split(',')

    let value = 0
  
    switch(name) {
      case 'exp':
        value = await exp(arguments); break
      case 'cosh':
        value = await cosh(arguments); break
      case 'sinh':
        value = await sinh(arguments); break
      case 'cos':
        value = await cos(arguments); break
      case 'sin':
        value = await sin(arguments); break
      case 'rad':
        value = await radian(arguments); break
      case 'deg':
        value = await degree(arguments); break
      case 'fact':
        value = await factorial(arguments); break
      case 'sqrt':
        value = await sqrt(arguments); break
      case 'abs':
        value = await abs(arguments); break
      case 'ln':
        value = await ln(arguments); break
      case 'log':
        value = await log(arguments); break
      default:
        throw new ComputorError({ data: { name }, code: 'unknownFunction' })
    }

    if (sign < 0) {
      return await Numeral.substract(0, value)
    } else {
      return value
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
