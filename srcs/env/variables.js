const Numeral = require('@classes/numeral.js')

const { Variables } = global

const resolveVariable = async (token) => {
  try {
    const id = (token[0].match(/\+|-/) ? token.substring(1, token.length) : token)
    const sign = (token[0] === '-' ? -1 : 1)

    for (const variable of Variables) {
      if (variable.id === id) {
        if (sign < 0) {
          return await Numeral.substract(0, variable.value)
        } else {
          return variable.value
        }
      }
    }

    if (id === 'i') {
      return new Numeral({ r: 0, i: (sign < 0 ? -1 : 1) })
    } else {
      throw { data: id, code: 'unknownVariable' }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { resolveVariable }