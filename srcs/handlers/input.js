const expressionValue = require('@srcs/maths/compute.js')

// Transform input string to lowercase only and remove all whitespaces
// then depending on the type of input, call the correct process.

module.exports = async (payload) => {
  const inputLine = payload.toLowerCase().replace(/^>| /g, '')

  if (inputLine === 'exit') {
    process.exit(0)
  }
  try {
    // Need to sanitize input before everything ! (= / =? + possible commands)
    if (inputLine.match(/^[0-9+\-\.\/*%^()i]+$/)) {
      return await expressionValue(inputLine)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
