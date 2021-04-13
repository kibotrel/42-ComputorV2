const parsePolynom = (polynom, side) => {
  const polynomInfos = { polynom, side, sign: 1, factor: 1, power: 0 }
  const foundMultiply = polynom.includes('*')
  const foundX = polynom.includes('x')
  const foundExponent = polynom.includes('^')
  const foundSign = polynom.startsWith('-') || polynom.startsWith('+')

  if (foundSign && polynom[0] === '-') {
    polynomInfos.sign = -1
  }

  if (foundX) {
    polynomInfos.power = 1
  }

  if (foundExponent) {
    polynomInfos.power = parseInt(polynom.substring(polynom.indexOf('^') + 1))
  }

  let factorString = polynom

  if (foundSign) {
    factorString = factorString.substring(1)
  }

  if (foundMultiply) {
    factorString = factorString.substring(0, factorString.indexOf('*'))
  } else if (foundX) {
    factorString = factorString.substring(0, factorString.indexOf('x'))
  }

  polynomInfos.factor = (factorString.length > 0 ? parseFloat(factorString) : 1)

  return polynomInfos
}

const parsePolynomList = async (equation) => {
  try {
    let sideID = 'l'
    let polynomList = []

    equation = equation.split('=')

    for (const side of equation) {
      const polynomString = side.match(/^(?:[+\-]?(?:(?:(?:\d+(?:\.\d+)?)(?:\*?x(?:\^\d+)?)?)|x(?:\^\d+)?))(?:[+\-](?:(?:(?:\d+(?:\.\d+)?)(?:\*?x(?:\^\d+)?)?)|x(?:\^\d+)?))*$/)
      
      if (!polynomString) {
        throw { data: polynomString, code: 'badPolynomList' }
      }

      const termList = side.split(/(?=[\-+])/)

      for (const polynom of termList) {
        polynomList.push(parsePolynom(polynom, sideID))
      }

      sideID = 'r'
    }

    return polynomList
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = async (equation) => {
  try {
    equation = equation.replace(/\s+/g, '')

    if (!equation.includes('=') || (equation.match(/=/g) || []).length !== 1) {
      throw { data: equation, code: 'notEquation' }
    } else if (!equation.match(/^[+-=*0-9x^]+$/)) {
      throw { data: equation, code: 'forbiddenCharacters' }
    }

    return await parsePolynomList(equation)
  } catch (error) {
    return Promise.reject(error) 
  }
}