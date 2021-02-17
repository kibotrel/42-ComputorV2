const { updateFlags } = require('@srcs/parsing/utils.js')

// These two functions are meant to certify that if the given
// infix expression contains brackets, they are appearing in
// the right order by stacking left brackets and destack on
// right brackets.

const leftBracket = async ({ string, i }, flags, infixStack, bracketStack) => {
  try {
    if (flags.numberStart !== -1) {
      infixStack.push(string.substring(flags.numberStart, i))
    }

    if (i !== 0) {
      if (string[i - 1].match(/[\d)]/)) {
        infixStack.push('*')
      } else if (string[i - 1] === '.') {
        throw { data: string, code: 'invalidLeftBracket', index: i }
      }
    }

    infixStack.push('(')
    bracketStack.push(1)
  } catch (error) {
    return Promise.reject(error)
  }
}

const rightBracket = async ({ string, i }, flags, infixStack, bracketStack) => {
  try {
    const lastElement = bracketStack.pop()

    if (lastElement === undefined || flags.operator || (i !== 0 && flags.decimal && string[i - 1] === '.')) {
      throw { data: string, code: 'invalidRightBracket', index: i }
    } else if (flags.numberStart !== -1) {
      infixStack.push(string.substring(flags.numberStart, i))
    }
    infixStack.push(')')
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { leftBracket, rightBracket }
