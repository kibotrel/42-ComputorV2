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

const printReducedEquation = (polynomList) => {
  let reducedEquation = ''

  if (polynomList[0].sign < 0) {
    reducedEquation += '-'
  }

  for (let i = 0; i < polynomList.length; i++) {
    if (polynomList[i].factor !== 0 || i === 0) {
      if (i !== 0) {
        reducedEquation += (polynomList[i].sign < 0 ? ' - ' : ' + ')
      }

      if (polynomList[i].factor !== 1 || polynomList[i].power === 0) {
        reducedEquation += `${polynomList[i].factor}`
      }

      if (polynomList[i].power && polynomList[i].factor !== 0) {
        reducedEquation += '𝑥'
      }

      if (polynomList[i].power > 1 && polynomList[i].factor !== 0) {
        reducedEquation += `${toSuperscript(polynomList[i].power)}`
      }
    }
  }

  reducedEquation += ' = 0'

  console.log(`\n\x1b[1;4mReduced form:\x1b[0m\n\n\t\x1b[33m${reducedEquation}\x1b[0m\n`)
}
module.exports = { printReducedEquation }