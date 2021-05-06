const Numeral = require('@classes/numeral.js')

const { Variables } = global

const sanitizeName = (token) => {
  let name
  
  if (token.indexOf('(') > 0) {
    name = token.substring(0, token.indexOf('('))
  } else {
    name = token
  }

  if (name[0].match(/\+|-/)) {
    name = name.substring(1)
  }

  return name
}

const resolveVariable = async (token) => {
  try {
    const id = sanitizeName(token)
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

const isVariableRegistered = (token) => {
  const name = sanitizeName(token)

  for (const variable of Variables) {
    if (variable.id === name) {
      return true
    }
  }

  return false
}

module.exports = { resolveVariable, isVariableRegistered, sanitizeName }