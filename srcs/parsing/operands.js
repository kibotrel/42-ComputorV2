const number = ({ string, i }, flags) => {
  try {
    if (flags.complex || flags.variable) {
      throw new ComputorError({ code: 'illegalCharacter' })
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
      throw new ComputorError({ data: { index: i }, code: 'illegalCharacter' })
    } else if (!flags.number || flags.decimal) {
      throw new ComputorError({ data: { string, index: i }, code: 'misformattedFloat' })
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
