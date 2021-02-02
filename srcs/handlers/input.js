const expressionValue = require('@srcs/maths/compute.js')

module.exports = async (payload) => {
  const inputLine = payload.toLowerCase().replace(/ /g, '').substring(1)

  if (inputLine === 'exit') {
    process.exit(0)
  }
  try {
    // Sanitize line beforehand
    if (inputLine.match(/^[0-9+\-\.\/*%^()]+$/)) {
      return await expressionValue(inputLine)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
