const registerHistory = (payload) => {
  if (!InputHistory.length || payload != InputHistory[InputHistory.length - 1]) {
    InputHistory.push(payload)
  }
}


module.exports = { registerHistory }
