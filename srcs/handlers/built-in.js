const exp = require('@builtin/exp.js')
const { cosh, sinh } = require('@builtin/hyperbolic.js')
const { cos, sin, rad, deg } = require('@builtin/trigonometric.js')

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
