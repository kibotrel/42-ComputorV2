// These two functions are meant to certify that if the given
// infix expression contains brackets, they are appearing in
// the right order by stacking left brackets and destack on
// right brackets.

const { isVariableRegistered } = require('@env/utils.js')

const { isFunction } = require('@srcs/parsing/utils.js')

const leftBracket = async ({ string, i }, flags, infixStack, bracketStack) => {
  try {
    let multiplySign = false

    // Check if we need to add a multiply sign between the bracket
    // and the token before it. This is happening if the last token
    // is either a number or a custom variable that isn't a function

    if (flags.numberStart !== -1) {
      if (flags.complex || flags.number) {
        infixStack.push(string.substring(flags.numberStart, i))
        multiplySign = true
      } else if (flags.variable) {
        const variableName = string.substring(flags.numberStart, i)
        let variable

        // Need to rework this part when built-in will be added.

        if (variableName[0].match(/[+\-]/)) {
          variable = await isVariableRegistered(variableName.substring(1))
        } else {
          variable = await isVariableRegistered(variableName)
        }

        if (!variable) {
          const remainingString = string.substring(i)
          const functionArguments = remainingString.substring(0, remainingString.indexOf(')') + 1)
          
          if (isFunction(`${variableName}${functionArguments}`)) {
            infixStack.push(`${variableName}${functionArguments}`)
            return i + functionArguments.length - 1
          } else {
            infixStack.push(string.substring(flags.numberStart, i))
            multiplySign = true
          }
        }
        else if (variable.constructor.name === 'Numeral') {
          infixStack.push(string.substring(flags.numberStart, i))
          multiplySign = true
        } else if (variable.constructor.name === 'Expression') {
          const remainingString = string.substring(i)
          const functionArguments = remainingString.substring(0, remainingString.indexOf(')') + 1)

          infixStack.push(`${variableName}${functionArguments}`)
          return i + functionArguments.length - 1
        }
      }

      if (multiplySign) {
        infixStack.push('*')
      }
    }

    if (i !== 0 && string[i - 1] === '.') {
      throw { data: string, code: 'invalidLeftBracket', index: i }
    }

    infixStack.push('(')
    bracketStack.push(1)
    return i
  } catch (error) {
    return Promise.reject(error)
  }
}

const rightBracket = async ({ string, i }, flags, infixStack, bracketStack) => {
  try {
    const lastElement = bracketStack.pop()

    if (lastElement === undefined || flags.operator || (i !== 0 && flags.decimal && string[i - 1] === '.')) {
      throw { data: string, code: 'invalidRightBracket', index: i }
    } else if (!flags.number && !flags.complex && !flags.variable && string[i - 1] !== ')') {
      throw { data: string, code: 'bracketsNotUsed', index: i }
    } else if (flags.numberStart !== -1) {
      infixStack.push(string.substring(flags.numberStart, i))
    }
    infixStack.push(')')
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { leftBracket, rightBracket }
