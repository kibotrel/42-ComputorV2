const { isVariableRegistered, sanitizeName, isValidBuiltin } = require('@env/utils.js')

const { numeralValue } = require('@srcs/maths/compute.js')

const { isFunction } = require('@srcs/parsing/utils.js')

const computeVariable = async (token, type) => {
  try {
    const variableName = sanitizeName(token)
    const sign = (token[0] === '-' ? -1 : 1)

    if (variableName === 'i') {
      return new Numeral({ r: 0, i: (sign < 0 ? -1 : 1) })
    }

    const variable = isVariableRegistered(variableName)

    if (!variable) {
      if (type === 'Function' && isValidBuiltin(token)) {
        return await builtinHandler(token)
      } else {
        throw new ComputorError({ data: { name: token } , code: `unknown${type}` })
      }
    }

    if (type === 'Variable' && variable.constructor.name !== 'Numeral') {
      throw new ComputorError({ data: { variable: variableName, expected: 'Numeral', found: variable.constructor.name }, code: 'incorrectDataType' })
    } else if (type === 'Function' && variable.constructor.name !== 'Expression') {
      throw new ComputorError({ data: { variable: variableName, expected: 'Expression', found: variable.constructor.name }, code: 'incorrectDataType' })
    }

    // Add Matrix constructor later

    if (variable.constructor.name === 'Numeral') {
      if (sign < 0) {
        return await Numeral.substract(0, variable)
      } else {
        return variable
      }
    } else if (variable.constructor.name === 'Expression') {
      const func = variable
      const arguments = token.substring(token.indexOf('(') + 1, token.lastIndexOf(')')).split(',')
      const argumentList = []

      if (!arguments[0]) {
        arguments.pop()
      }

      if (!arguments.length) {
        throw new ComputorError({ code: 'emptyExpression' })
      } else if (arguments.length !== func.variables.length) {
        throw new ComputorError({ data: { name: func.name, found: arguments.length, expected: func.variables.length }, code: 'incorrectParameterAmount' })
      }

      for (const argument of arguments) {
        const value = await numeralValue(argument)
    
        argumentList.push(value)
      }

      const value = await Expression.evaluate(func, argumentList)

      if (sign < 0) {
        return await Nummeral.substract(0, value)
      } else {
        return value
      }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

// This function ensure Expression system integrity by removing
// Expression prototypes when a new version a Expression composite
// does not have the same amount of variables than its previous
// version and also recursively sanitize the Expression list by
// removing every Expression where the deleted one imply another
// conflict.

const removeDependencies = (tested) => {
  const deletedExpressions = []

  for (let i = 0; i < Variables.length; i++) {
    const variable = Variables[i].value

    if (variable.constructor.name === 'Expression') {
      for (const token of variable.definition) {
        if (isFunction(token)) {
          const tokenName = token.substring(0, token.indexOf('('))

          if (tested.name === tokenName && tested.variables.length != variable.variables.length) {
            Variables.splice(i, 1)

            deletedExpressions.push(variable)
            Array.prototype.push.apply(deletedExpressions, removeDependencies(variable.name))

            break
          }
        }
      }
    }
  }

  return deletedExpressions
}
const checkExpressions = (expression) => {
  const deletedExpressions = removeDependencies(expression)

  const promptedExpressions = []

  for (const expression of deletedExpressions) {
    promptedExpressions.push(`\t- ${expression.print()}`)
  }

  if (deletedExpressions.length) {
    console.log(`\x1b[1mFound \x1b[33m${deletedExpressions.length}\x1b[0;1m conflict(s) induced by this \x1b[32mExpression\x1b[0;1m:\x1b[0m\n\n${promptedExpressions.join('\n')}\n\n\x1b[1mThis list of \x1b[32mExpression\x1b[0;1m has been deleted.\x1b[0m\n`)
  }
}

module.exports = { computeVariable, checkExpressions }
