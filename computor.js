// module-alias is a small modules used to simplify
// require calls using aliases stored in package.json.

require('module-alias/register')

// Readline is a standard module to read from console and
// create an interface to communicate to communicate with it.

const Reader = require('readline')
const Client = Reader.createInterface({ input: process.stdin, output: process.stdout })

// This variable holds the configuration of the program. It
// can be read and modified everywhere else.

global.Config = require('@configs/env.json')

// This variable holds every single registered variable
// during the program context and can be read and modified
// everywhere else.

global.Variables = []

/// This variable holds the lasts commands sent to the
// program's context.

global.InputHistory = []

// This class is used to record errors during program's
// context.

global.ComputorError = require('@classes/error.js')

// Custom classes that are designated to handle math stuff
// that is related to each one.

global.Numeral = require('@classes/numeral.js')
global.Expression = require('@classes/expression.js')
global.Matrix = require('@classes/matrix.js')

// Some usefull functions that are needed quite often.
// Making them global helps to avoid circular dependencies.

global.numeralValue = require('@srcs/maths/compute.js').numeralValue
global.builtinHandler = require('@handlers/built-in.js')

const inputHandler = require('@handlers/input.js')
const errorHandler = require('@handlers/error.js')

const { checkExpressions } = require('@env/variables.js')

const processData = ({ value, type }) => {
  if (type === 'computation') {
    console.log(`\n\x1b[1mComputation result:\x1b[0m\n\n\t${value.print()}\n`)
  } else if (type.match(/^(expression|numeral|matrix)$/)) {
    console.log(`\n\x1b[1mNew \x1b[32m${value.constructor.name}\x1b[0;1m stored!\x1b[0m\n\n\t${value.print()}\n`)
  }
  
  if (type === 'expression') {
    checkExpressions(value)
  }
}

Client.write('> ')

Client.on('line', async (payload) => {
  try {
    processData(await inputHandler(payload))
  } catch (error) {
    errorHandler(error)
  }

  Client.write('> ')
})
