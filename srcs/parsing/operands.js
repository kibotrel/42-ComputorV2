const { updateFlags } = require('@srcs/parsing/utils.js')

const variable = ({ string, i, flags }) => {
  if (!flags.number && !flags.sign) {
    flags.numberStart = i
  }

  return updateFlags({ number: true, numberStart: flags.numberStart})
}

const decimal = async ({ string, i, flags }) => {
  try {
    if (!flags.number || flags.decimal) {
      throw { data: string, code: 'misformattedFloat', index: i }
    } else {
      return updateFlags({ number: true, decimal: true, numberStart: flags.numberStart })
    }
  } catch (error) {
    return Promise.reject(error)
  }
}


module.exports = { variable, decimal }
