const { updateFlags } = require("@srcs/parsing/utils.js")

const isVariableBeforeOperator = ({ string, i, flags }, infixStack) => {
  if (flags.numberStart !== -1) {
    infixStack.push(string.substring(flags.numberStart, i))

    return updateFlags({ power: flags.power, operator: flags.operator })
  } else {
    return flags
  }
}

const operatorErrors = async ({ string, i, flags }) => {
  try {
    if (flags.operator || string[i].match(/[*\/%^]/) && (i === 0 || flags.number)) {
      throw { data: string, code: 'invalidOperatorPosition', index: i }
    } else if (string[i].match(/[*\/%^]/) && flags.decimal && !string[i - 1].match(/\d/)) {
      throw { data: string, code: 'misformattedFloat', index: i - 1 }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const unaryOperatorCheck = ({ string, i, flags }, infixStack) => {
  if (string[i].match(/[+\-]/) && (i === 0 || string[i - 1] === '(')) {
    if (string[i + 1] === '(') {
      infixStack.push('0')
      infixStack.push(string[i])
    } else {
      flags.sign = true
      flags.numberStart = i
    }
  } else {
    infixStack.push(string[i])
  }

  return updateFlags({ power: flags.power, operator: true, sign: flags.sign, numberStart: flags.numberStart})
}

module.exports = async ({ string, i, flags }, infixStack) => {
  try {
    flags = isVariableBeforeOperator({ string, i, flags }, infixStack)

    await operatorErrors({ string, i, flags })

    flags.power = (string[i] === '^' ? true : false)
    flags = unaryOperatorCheck({ string, i, flags }, infixStack)

    return updateFlags({ power: flags.power, operator: true, sign: flags.sign, numberStart: flags.numberStart })
  } catch (error) {
    return Promise.reject(error)
  }
}
