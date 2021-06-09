const isVariableRegistered = (token) => {
  const name = sanitizeName(token)

  for (const variable of Variables) {
    if (variable.id === name) {
      return variable.value
    }
  }

  return false
}

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

const countDigits = (number) => {
  return number.toString().length
}

const fillDigits = (number, targetSize) => {
  const template = '0'
  const numberSize = countDigits(number)
  const digitsToAdd = targetSize - numberSize

  return `${template.repeat(digitsToAdd)}${number.toString()}`
}

module.exports = { isVariableRegistered, sanitizeName, countDigits, fillDigits }
