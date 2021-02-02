const updateFlags = ({ power, number, operator, decimal, sign, numberStart }) => {
  const newFlags = {
    power,
    number,
    operator,
    decimal,
    sign,
    numberStart: numberStart === undefined ? -1 : numberStart
  }

  return newFlags
}

module.exports = { updateFlags }
