const number = ({ string, i }, flags) => {
  try {
    if (flags.complex || flags.variable) {
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
    if (flags.complex || flags.variable) {
      throw { data: string, code: 'illegalTerm', index: i }
    } else if (!flags.number || flags.decimal) {
      throw { data: string, code: 'misformattedFloat', index: i }
    }

    flags.decimal = true
  } catch (error) {
    return Promise.reject(error)
  }
}

const variable = async ({ string, i }, flags) => {
  try {
    const current = string[i]

    if (current === 'i' && !flags.variable) {
      flags.complex = true

      if (flags.numberStart < 0) {
        flags.numberStart = i
      } 
    } else if (!flags.variable) {
      flags.variable = true

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
