const number = ({ string, i }, flags) => {
  try {
    if (flags.complex) {
      throw { data: string, code: 'illegalTerm', index: i }
    }

    if (!flags.number && !flags.sign) {
      flags.numberStart = i
    }

    flags.number = true
    flags.operator = false
  } catch (error) {
    return Promise.reject(error)
  }
}

const decimal = async ({ string, i }, flags) => {
  try {
    if (flags.complex) {
      throw { data: string, code: 'illegalTerm', index: i }
    } else if (!flags.number || flags.decimal) {
      throw { data: string, code: 'misformattedFloat', index: i }
    }

    flags.decimal = true
  } catch (error) {
    return Promise.reject(error)
  }
}

const variable = async ({ string, i }, flags, infixStack) => {
  try {
    const current = string[i]
    const previous = i > 0 ? string[i - 1] : ''
    const next = string.length - i > 1 ? string[i + 1] : ''

    if (current === 'i' && !next.match(/[a-z]/) && !previous.match(/[a-z]/)) {
      flags.complex = true

      if (flags.numberStart < 0) {
        flags.numberStart = i
      } 
    }

    flags.operator = false
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { number, decimal, variable }
