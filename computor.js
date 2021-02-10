require('module-alias/register')

// Readline is a standard module to read from console and
// create an interface to communicate to communicate with it.

const Reader = require('readline')
const Client = Reader.createInterface({ input: process.stdin, output: process.stdout })

const inputHandler = require('@srcs/handlers/input.js')
const errorHandler = require('@srcs/handlers/error.js')

Client.write('> ')

Client.on('line', async (payload) => {
  try {
    const feedback = await inputHandler(payload)
    console.log(feedback)
  } catch (error) {
    errorHandler(error)
  }

  Client.write('> ')
})
