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

const inputHandler = require('@srcs/handlers/input.js')
const errorHandler = require('@srcs/handlers/error.js')

Client.write('> ')

Client.on('line', async (payload) => {
  try {
    const feedback = await inputHandler(payload)
    console.log(feedback)
    console.log(feedback.print())
  } catch (error) {
    errorHandler(error)
  }

  Client.write('> ')
})
