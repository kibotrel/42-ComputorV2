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

module.exports = { isVariableRegistered, sanitizeName }