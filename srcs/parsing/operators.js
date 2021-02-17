const isVariableBeforeOperator = ({string, i}, flags, infixStack) => {
  if (flags.numberStart !== -1) {
    infixStack.push(string.substring(flags.numberStart, i))

    flags.numberStart = -1
    flags.number = false
    flags.complex = false
    flags.variable = false
    flags.sign = false
  }
}

const operatorErrors = async ({ string, i }, flags) => {
  try {
    if (flags.operator || (string[i].match(/[*\/%^]/) && (i === 0 || flags.number))) {
      throw { data: string, code: 'invalidOperatorPosition', index: i }
    } else if (string[i].match(/[+\-*\/%^]/) && flags.decimal && !string[i - 1].match(/\d/)) {
      throw { data: string, code: 'misformattedFloat', index: i - 1 }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const unaryOperatorCheck = ({ string, i}, flags, infixStack) => {
  // This first check fix an issue when converting -(expression) or (-expression)
  // to postfix by substituing this by 0 - (expression) or (0 - expression) which
  // are valid inputs for the infix to postfix expression parser.

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
}

module.exports = async ({ string, i}, flags, infixStack) => {
  try {
    isVariableBeforeOperator({ string, i }, flags, infixStack)
    await operatorErrors({ string, i }, flags)
    unaryOperatorCheck({ string, i }, flags, infixStack)

    flags.power = (string[i] === '^' ? true : false)
    flags.operator = true
    flags.number = false
    flags.decimal = false
    flags.complex = false
    flags.variable = false
  } catch (error) {
    return Promise.reject(error)
  }
}
