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

const inputHandler = require('@srcs/handlers/input.js')
const errorHandler = require('@srcs/handlers/error.js')

Client.write('> ')

Client.on('line', async (payload) => {
  try {
    const { value, type } = await inputHandler(payload)

    if (type === 'computation') {
      console.log(`\n\x1b[1mComputation result :\x1b[0m\n\n\t${value.print()}\n`)
    } else if (type.match(/^(expression|numeral)$/)) {
      console.log(`\n\x1b[1mNew \x1b[32m${value.constructor.name}\x1b[0;1m stored!\x1b[0m\n\n\t${value.print()}\n`)
    }
  } catch (error) {
    errorHandler(error)
  }

  Client.write('> ')
}) 

