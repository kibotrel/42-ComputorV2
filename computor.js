require('module-alias/register')

const Reader = require('readline')
const Client = Reader.createInterface({ input: process.stdin, output: process.stdout })

const realComputation = require('@srcs/computation/real.js')

Client.write('> ')

Client.on('line', async (input) => {
  input = input.toLowerCase().replace(/ /g, '').substring(1)
  
  if (input === 'exit') {
    process.exit(0)
  }

  if (input.match(/^[0-9+\-\.\/*%^()]+$/)) {
    try {
      const feedback = await realComputation(input)

      console.log(feedback)
    } catch (error) {
      console.log(`Error: ${error.code} at index: ${error.index}`)
    }
  }

  Client.write('> ')

})