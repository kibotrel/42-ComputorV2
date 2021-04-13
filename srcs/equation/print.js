const { toSuperscript } = require('@srcs/equation/utils.js')

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
  const root = parseFloat(Number(-c / b).toPrecision(Config.number.toPrecision))

  console.log('\n\x1b[1;4mSolution(s):\x1b[0m\n')
  
  if (Config.equation.verbose) {
    console.log(`\t\x1b[2mVariables:\n\n\t\ta = ${b}, b = ${c}\n\n\tResolution:\n\n\t\tx = -a / b\n\t\tx = ${-c} / ${b}\n\t\t\x1b[4mx = ${root}\n\x1b[0m`)
  }

  console.log(`\tThe solution to this equation is \x1b[1;33m${root}\x1b[0m.\n`)
}

const printQuadratic = (b, c) => {
  const root = parseFloat(Number(-c / b).toPrecision(Config.number.toPrecision))
}
module.exports = { printReducedEquation, printEquationType, printConstant, printLinear, printQuadratic }