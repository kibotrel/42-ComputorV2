const trueValue = (value) => {
  if (value > -1 && value < 1) {
    return parseFloat(value.toFixed(Config.number.precision))
  } else {
    return parseFloat(value.toPrecision(Config.number.precision))
  }
}

module.exports = { trueValue }