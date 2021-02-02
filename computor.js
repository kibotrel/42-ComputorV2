require('module-alias/register')

const Reader = require('readline')
const Client = Reader.createInterface({ input: process.stdin, output: process.stdout })

const inputHandler = require('@srcs/handlers/input.js')
const errorHandler = require('@srcs/handlers/error.js')

Client.write('> ')


// Checks for Infinity to avoid miscalculations for
// each variable and the current value of the topmost
// in the stack during expressionValue(inputLine)

Client.on('line', async (payload) => {
  try {
    const feedback = await inputHandler(payload)
    console.log(feedback)
  } catch (error) {
    errorHandler(error)
  }

  Client.write('> ')
})
