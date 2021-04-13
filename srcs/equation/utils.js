const toSuperscript = (number) => {
  const superscriptDigits = '⁰¹²³⁴⁵⁶⁷⁸⁹'
  const numberString = number.toString()

  if (!numberString.match(/^\d+$/)) {
    return number
  } else {
    let superscriptNumber = ''

    for(let i = 0; i < numberString.length; i++) {
      superscriptNumber += superscriptDigits[parseInt(numberString[i])]
    }

    return superscriptNumber
  }
}

const equationDegree = polynomList => {
  for (const polynom of polynomList) {
    if (polynom.factor != 0) {
      return polynom.power
    }
  }

  // To handle the case where all power (including 0) have a
  // factor of 0.

  return 0
}

module.exports = { toSuperscript, equationDegree }