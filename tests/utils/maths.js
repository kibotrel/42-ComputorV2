const trueValue = (value) => {
  return parseFloat(value.toPrecision(Config.number.precision))
}

module.exports = { trueValue }