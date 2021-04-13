const { toSuperscript } = require('@srcs/equation/utils.js')
const Numeral = require('@classes/numeral.js')

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

  console.log(`\n\x1b[1;4mReduced form:\x1b[0m\n\n\t\x1b[33;1m${reducedEquation}\x1b[0m\n`)
}

const printEquationType = (degree) => {
  const types = {
    0: 'constant',
    1: 'linear',
    2: 'quadratic'
  }

  if (degree <= 2) {
    console.log(`\x1b[1;4mPolynomial degree:\x1b[0m\n\n\tThis is a \x1b[33;1m${types[degree]}\x1b[0m equation (degree ${degree}).`)
  } else {
    console.log(`\x1b[1;4mPolynomial degree:\x1b[0m\n\n\tThis is a polynomial equation of degree \x1b[33;1m${degree}\x1b[0m.\n\n\tUnfortunately, this software cannot solve\n\tpolynomial equations of degree higher than \x1b[33;1m2\x1b[0m.\n`)
  }
}

const printConstant = (c) => {
  console.log('\n\x1b[1;4mSolution(s):\x1b[0m\n')

  if (c === 0) {
    console.log('\t\x1b[33;1mℝ\x1b[0m, the set of real number is the solution to this equation.\n')
  } else {
    console.log('\tThis equation does not have any solution.\n')
  }
}

const printLinear = (b, c) => {
  const root = new Numeral({ r: -c / b, i: 0 })

  console.log('\n\x1b[1;4mSolution(s):\x1b[0m\n')
  
  if (Config.equation.verbose) {
    console.log(`\t\x1b[2mVariables:\n\n\t\ta = ${b}, b = ${c}\n\n\tResolution:\n\n\t\tx = -a / b\n\t\tx = ${-c} / ${b}\n\t\t\x1b[4mx = ${root.print()}\n\x1b[0m`)
  }

  console.log(`\tThe solution to this equation is \x1b[1;33m${root.print()}\x1b[0m.\n`)
}

const printQuadratic = async (a, b, c) => {
  try {
    const discriminant = new Numeral({ r: (b * b) - ( 4 * a * c), i: 0 })

    console.log('\n\x1b[1;4mSolution(s):\x1b[0m\n')

    if (Config.equation.verbose) {
      console.log(`\t\x1b[2mVariables:\n\n\t\ta = ${a}, b = ${b}, c = ${c}, Δ = ${discriminant.print()}\x1b[0m\n`)
    }

    if (discriminant.r > 0) {
      const positiveRoot = new Numeral({ r: (-b + discriminant.r ** 0.5) / (2 * a), i: 0 })
      const negativeRoot = new Numeral({ r: (-b - discriminant.r ** 0.5) / (2 * a), i: 0 })

      if (Config.equation.verbose) {
        console.log(`\t\x1b[2mResolution:\n\n\t\tx'= (-b + √Δ) / 2 * a\n\t\tx'= (${-b} + ${discriminant.r ** 0.5}) / ${2 * a}\n\t\t\x1b[2;4mx'= ${positiveRoot.print()}\x1b[0;2m\n\n\t\tx"= (-b - √Δ) / 2 * a\n\t\tx"= (${-b} - ${discriminant.r ** 0.5}) / ${2 * a}\n\t\t\x1b[2;4mx"= ${negativeRoot.print()}\x1b[0m\n`)
      }

      console.log(`\tThe discriminant of this equation is strictly positive (\x1b[1;33m${discriminant.print()}\x1b[0m).\n\tSo it has two real roots: \x1b[1;33m${positiveRoot.print()}\x1b[0m and \x1b[1;33m${negativeRoot.print()}\x1b[0m.\n`)
    } else if (discriminant.r === 0) {
      const zeroRoot = new Numeral({ r: -b / (2 * a), i: 0 })

      if (Config.equation.verbose) {
        console.log(`\t\x1b[2mResolution:\n\n\t\tx = -b / 2a\n\t\tx = ${-b} / ${2 * a}\n\t\t\x1b[4mx = ${zeroRoot.print()}\x1b[0m\n`)
      }

      console.log(`\tThe discriminant of this equation is equal to \x1b[33;1m0\x1b[0m.\n\tSo it has a unique real root: \x1b[1;33m${zeroRoot}\x1b[0m.\n`)
    } else {
      const absoluteDiscriminant = new Numeral({ r: Math.sqrt(Math.abs(discriminant.r)), i: 0 })

      const denominator = new Numeral({ r: 2 * a, i: 0 })
      const numerator1 = new Numeral({ r: -b, i: absoluteDiscriminant.r })
      const numerator2 = new Numeral({ r: -b, i: -absoluteDiscriminant.r })
      const positiveComplexRoot = await Numeral.divide(numerator1, denominator)
      const negativeComplexRoot = await Numeral.divide(numerator2, denominator)

      if (Config.equation.verbose) {
        console.log(`\t\x1b[2mResolution:\n\n\t\tz' = (-b - √|Δ| * i) / 2a\n\t\t\z' = (${-b} - ${absoluteDiscriminant.r} * i) / ${2 * a}\n\t\t\x1b[4mz' = ${positiveComplexRoot.print()}\x1b[0;2m\n\n\t\tz" = (-b + √|Δ| * i) / 2a\n\t\tz" = (${-b} + ${absoluteDiscriminant.r} * i) / ${2 * a}\n\t\t\x1b[4mz" = ${negativeComplexRoot.print()}\x1b[0m\n`)
      }

      console.log(`\tThe discriminant of this equation is stricly negative (\x1b[1;33m${discriminant.print()}\x1b[0m).\n\tIt has two complex roots: \x1b[1;33m${positiveComplexRoot.print()}\x1b[0m and \x1b[1;33m${negativeComplexRoot.print()}\x1b[0m.\n`)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { printReducedEquation, printEquationType, printConstant, printLinear, printQuadratic }
