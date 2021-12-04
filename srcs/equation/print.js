const { sqrt, abs } = require('@builtin/algebraic.js')

const { toSuperscript } = require('@srcs/equation/utils.js')

const { toNumeral } = require('@srcs/maths/utils.js')

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
  if (!Config.env.silentMode) {
    console.log('\n\x1b[1;4mSolution(s):\x1b[0m\n')

    if (c === 0) {
      console.log('\t\x1b[33;1mℝ\x1b[0m, the set of real number is the solution to this equation.\n')
    } else {
      console.log('\tThis equation does not have any solution.\n')
    }
  }
}

const printLinear = async (b, c) => {
  b = new Numeral(await toNumeral(b))
  c = new Numeral(await toNumeral(c))
  
  const minusC = await Numeral.substract(0, c)
  const root = await Numeral.divide(minusC, b)

  if (!Config.env.silentMode) {
    console.log('\n\x1b[1;4mSolution:\x1b[0m\n')

    if (Config.equation.verbose) {
      console.log(`\t\x1b[2mVariables:\n\n\t\ta = ${b.print()}\x1b[2m, b = ${c.print()}\x1b[2m\n`)
      console.log('\tResolution:\n\n\t\tx = -b / a')
      console.log(`\t\tx = ${Config.number.fractionForm && !Number.isInteger(minusC.r) ? `(${minusC.print()}\x1b[2m)` : minusC.print()}\x1b[2m / ${Config.number.fractionForm && !Number.isInteger(b.r) ? `(${b.print()}\x1b[2m)` : b.print()}`)
      console.log(`\t\t\x1b[4m\x1b[2mx = ${root.print()}\n\x1b[0m`)
    }

    console.log(`\tThe solution to this equation is \x1b[1;33m${root.print()}\x1b[0m.\n`)
  }
}

const printQuadratic = async (a, b, c) => {
  try {
    a = new Numeral(await toNumeral(a))
    b = new Numeral(await toNumeral(b))
    c = new Numeral(await toNumeral(c))

    const discriminant = await Numeral.substract(await Numeral.power(b, 2), await Numeral.multiply(4, await Numeral.multiply(a, c)))

    const minusB = await Numeral.substract(0, b)
    const twoA = await Numeral.multiply(2, a)

    if (!Config.env.silentMode) {
      console.log('\n\x1b[1;4mSolution(s):\x1b[0m\n')

      if (Config.equation.verbose) {
        console.log(`\t\x1b[2mVariables:\n\n\t\ta = ${a.print()}\x1b[2m, b = ${b.print()}\x1b[2m, c = ${c.print()}\x1b[2m, Δ = ${discriminant.print()}\x1b[0m\n`)
      }
    }

    if (discriminant.r > 0) {
      const sqrtDiscriminant = await sqrt([discriminant.r])
      const positiveRoot = await Numeral.divide(await Numeral.add(minusB, sqrtDiscriminant), twoA)
      const negativeRoot = await Numeral.divide(await Numeral.substract(minusB, sqrtDiscriminant), twoA)

      if (!Config.env.silentMode) {
        if (Config.equation.verbose) {
          console.log('\t\x1b[2mResolution:\n\n\t\tx\'= (-b + √Δ) / 2a')
          console.log(`\t\tx'= (${minusB.print()}\x1b[2m + ${sqrtDiscriminant.print()}\x1b[2m) / ${Config.number.fractionForm && !Number.isInteger(twoA.r) ? `(${twoA.print()}\x1b[2m)` : twoA.print()}`)
          console.log(`\t\t\x1b[2;4mx'= ${positiveRoot.print()}\x1b[0;2m\n`)
          console.log('\n\t\tx"= (-b - √Δ) / 2a')
          console.log(`\t\tx"= (${minusB.print()}\x1b[2m - ${sqrtDiscriminant.print()}\x1b[2m) / ${Config.number.fractionForm && !Number.isInteger(twoA.r) ? `(${twoA.print()}\x1b[2m)` : twoA.print()}`)
          console.log(`\t\t\x1b[2;4mx"= ${negativeRoot.print()}\x1b[0m\n`)
        }

        console.log(`\tThe discriminant of this equation is strictly positive (\x1b[1;33m${discriminant.print()}\x1b[0m).\n\tSo it has two real roots: \x1b[1;33m${positiveRoot.print()}\x1b[0m and \x1b[1;33m${negativeRoot.print()}\x1b[0m.\n`)
      }
    } else if (discriminant.r === 0) {
      const zeroRoot = await Numeral.divide(minusB, twoA)

      if (!Config.env.silentMode) {
        if (Config.equation.verbose) {
          console.log('\t\x1b[2mResolution:\n\n\t\tx = -b / 2a')
          console.log(`\t\tx = ${Config.number.fractionForm && !Number.isInteger(minusB.r) ? `(${minusB.print()}\x1b[2m)` : minusB.print()}\x1b[2m / ${Config.number.fractionForm && !Number.isInteger(twoA.r) ? `(${twoA.print()}\x1b[2m)` : twoA.print()}`)
          console.log(`\t\t\x1b[4m\x1b[2mx = ${zeroRoot.print()}\x1b[0m\n`)
        }

        console.log(`\tThe discriminant of this equation is equal to \x1b[33;1m0\x1b[0m.\n\tSo it has a unique real root: \x1b[1;33m${zeroRoot.print()}\x1b[0m.\n`)
      }
    } else {
      const absoluteDiscriminant = await sqrt([await abs([discriminant.r])])

      const positiveComplex = new Numeral({ r: minusB.r, i: absoluteDiscriminant.r, ni: absoluteDiscriminant.nr, di: absoluteDiscriminant.dr })
      const negativeComplex = new Numeral({ r: minusB.r, i: -absoluteDiscriminant.r, ni: -absoluteDiscriminant.nr, di: absoluteDiscriminant.dr })
      const positiveComplexRoot = await Numeral.divide(positiveComplex, twoA)
      const negativeComplexRoot = await Numeral.divide(negativeComplex, twoA)

      if (!Config.env.silentMode) {
        if (Config.equation.verbose) {
          console.log('\t\x1b[2mResolution:\n\n\t\tz\' = (-b - √|Δ| * i) / 2a')
          console.log(`\t\t\z' = (${negativeComplex.print()}\x1b[2m) / ${Config.number.fractionForm && !Number.isInteger(twoA.r) ? `(${twoA.print()}\x1b[2m)` : twoA.print()}`)
          console.log(`\t\t\x1b[4m\x1b[2mz' = ${negativeComplexRoot.print()}\x1b[0;2m\n`)
          console.log('\t\tz" = (-b + √|Δ| * i) / 2a\n')
          console.log(`\t\tz" = (${positiveComplex.print()}\x1b[2m) / ${Config.number.fractionForm && !Number.isInteger(twoA.r) ? `(${twoA.print()}\x1b[2m)` : twoA.print()}`)
          console.log(`\t\t\x1b[4m\x1b[2mz" = ${positiveComplexRoot.print()}\x1b[0m\n`)
        }

        console.log(`\tThe discriminant of this equation is stricly negative (\x1b[1;33m${discriminant.print()}\x1b[0m).\n\tIt has two complex roots: \x1b[1;33m${positiveComplexRoot.print()}\x1b[0m and \x1b[1;33m${negativeComplexRoot.print()}\x1b[0m.\n`)
      }
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { printReducedEquation, printEquationType, printConstant, printLinear, printQuadratic }
