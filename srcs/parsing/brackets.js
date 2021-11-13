const { isVariableRegistered, isValidBuiltin } = require('@env/utils.js')

const { isComposite, isFunction, compositeParts } = require('@srcs/parsing/utils.js')

const lookForEnclosure = (string) => {
  const stack = []

  for (let i = 0; i < string.length; i++) {
    if (string[i] === '(') {
      stack.push(i)
    } else if (string[i] === ')') {
      stack.pop()

      if (!stack.length) {
        return i
      }
    }
  }
}

// These two functions are meant to certify that if the given
// infix expression contains brackets, they are appearing in
// the right order by stacking left brackets and destack on
// right brackets.

const leftBracket = async ({ string, i }, flags, infixStack, bracketStack) => {
  try {
    // Check if we need to add a multiply sign between the bracket
    // and the token before it. This is happening if the last token
    // is either a number or a custom variable that isn't a function.

    if (flags.numberStart !== -1) {
      let multiplySign = false

      if (flags.complex || (flags.number && !flags.variable)) {
        infixStack.push(string.substring(flags.numberStart, i))
        multiplySign = true
      } else if (flags.variable) {
        // Determine if the opperand is either a function, a variable
        // or a composite (value mulltiplied by either of the above)
        // then check if the function / variable is stored and resolve it
        // if found.

        let variableName = string.substring(flags.numberStart, i)
        let factor

        if (isComposite(variableName)) {
          const compositeData = compositeParts(variableName)

          factor = compositeData.factor
          variableName = compositeData.variableName
        }

        const variable = await isVariableRegistered(variableName)

        if (variable.constructor.name === 'Numeral') {
          if (factor) {
            infixStack.push('(', factor, '*', variableName, ')')
          } else {
            infixStack.push(variableName)
          }
          multiplySign = true
        } else if (variable.constructor.name === 'Expression' || isValidBuiltin(variableName)) {
          const remainingString = string.substring(i)
          const closingIndex = lookForEnclosure(remainingString)
          const functionArguments = remainingString.substring(0, closingIndex + 1)

          variableName = `${variableName}${functionArguments}`

          if (!isFunction(variableName) && !isComposite(variableName) && !isValidBuiltin(variableName)) {
            throw new ComputorError({ data: { expression: variableName }, code: 'illegalExpression' })
          }

          if (factor) {
            if (factor.length === 1 && factor.match(/[+\-]/)) {
              factor = `${factor}1`
            }
            infixStack.push('(', factor, '*', variableName, ')')
          } else {
            infixStack.push(variableName)
          }

          return i + functionArguments.length - 1
        } else {
          throw new ComputorError({ data: { name: variableName }, code: 'unknownVariable' })
        }
      }

      if (multiplySign) {
        infixStack.push('*')
      }
    }

    if (i !== 0 && string[i - 1] === '.') {
      throw new ComputorError({ data: { string, index: i }, code: 'invalidLeftBracket' })
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
      throw  new ComputorError({ data: { string, index: i }, code: 'invalidRightBracket' })
    } else if (!flags.number && !flags.complex && !flags.variable && string[i - 1] !== ')') {
      throw new ComputorError({ data: { string, index: i }, code: 'bracketsNotUsed' })
    } else if (flags.numberStart !== -1) {
      infixStack.push(string.substring(flags.numberStart, i))
    }
    infixStack.push(')')
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { leftBracket, rightBracket, lookForEnclosure }
