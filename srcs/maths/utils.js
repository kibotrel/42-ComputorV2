const checkNumeral = async (numeral, operator) => {
  try {
    if (numeral === undefined) {
      throw { data: operator, code: 'invalidOperation' }
    } else if (Object.values(numeral).find(num => num === Number.NEGATIVE_INFINITY || num === Number.POSITIVE_INFINITY)) {
      throw { code: 'tooBigNumber' }
    } else if (Object.values(numeral).find(num => Number.isNaN(num))) {
      throw { data: numeral, code: 'notNumber'}
    }

    return numeral
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { checkNumeral }
