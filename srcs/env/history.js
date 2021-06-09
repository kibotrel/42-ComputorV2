const registerHistory = (payload) => {
  const sanitizedPayload = payload.substring(2, payload.length)

  if (!InputHistory.length || sanitizedPayload != InputHistory[InputHistory.length - 1]) {
    InputHistory.push(sanitizedPayload)
  }
}


module.exports = { registerHistory }
