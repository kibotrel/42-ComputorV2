const { remainder, abs, floor } = require('@srcs/maths/basic-functions.js')
const { addFraction, multiplyFraction, divideFraction, modulusFraction } = require('@srcs/maths/fractions.js')
const { checkNumeral, toNumeral, numeralFractionalParts } = require('@srcs/maths/utils.js')

// r stands for real, i for imaginary, n for numerator and d for denominator

class Numeral {
  constructor({ r, i, nr, ni, dr, di }) {
    this.r = r
    this.i = i
    this.nr = nr === undefined ? r : nr
    this.dr = dr === undefined ? 1 : dr
    this.ni = ni === undefined ? i : ni
    this.di = di === undefined ? 1 : di
  }

  static async add(a, b) {
    try {
      const A = toNumeral(a)
      const B = toNumeral(b)

      const { re: re1, im: im1 } = numeralFractionalParts(A)
      const { re: re2, im: im2 } = numeralFractionalParts(B)

      const { n: nr, d: dr } = addFraction(re1, re2, '+')
      const { n: ni, d: di } = addFraction(im1, im2, '+')

      const result = new Numeral({
        r: A.r + B.r,
        i: A.i + B.i,
        nr, dr, ni, di
      })

      return await checkNumeral(result, '+')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async substract(a, b) {
    try {
      const A = toNumeral(a)
      const B = toNumeral(b)

      const { re: re1, im: im1 } = numeralFractionalParts(A)
      const { re: re2, im: im2 } = numeralFractionalParts(B)

      const { n: nr, d: dr } = addFraction(re1, re2, '-')
      const { n: ni, d: di } = addFraction(im1, im2, '-')

      const result = new Numeral({
        r: A.r - B.r,
        i: A.i - B.i,
        nr, dr, ni, di
      })

      return await checkNumeral(result, '-')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async multiply(a, b) {
    try {
      const A = toNumeral(a)
      const B = toNumeral(b)
      
      const { re: re1, im: im1 } = numeralFractionalParts(A)
      const { re: re2, im: im2 } = numeralFractionalParts(B)

      const tempR1 = multiplyFraction(re1, re2)
      const tempR2 = multiplyFraction(im1, im2)
      const { n: nr, d: dr } = addFraction(tempR1, tempR2, '-')

      const tempI1 = multiplyFraction(re1, im2)
      const tempI2 = multiplyFraction(im1, re2)
      const { n: ni, d: di } = addFraction(tempI1, tempI2, '+')

      const result = new Numeral({
        r: A.r * B.r - A.i * B.i,
        i: A.r * B.i + A.i * B.r,
        nr, dr, ni, di
      })

      return await checkNumeral(result, '*')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async divide(a, b) {
    try {
      const A = toNumeral(a)
      const B = toNumeral(b)
      
      if (B.r === 0 && B.i === 0) {
        throw { data: { A, B, operator: '/' }, code: 'impossibleDivision' }
      }

      const { re: re1, im: im1 } = numeralFractionalParts(A)
      const { re: re2, im: im2 } = numeralFractionalParts(B)
      const re1N = { n: -re1.n, d: re1.d }

      const tempRN1 = multiplyFraction(re1, re2)
      const tempRN2 = multiplyFraction(im1, im2)
      const tempRN3 = addFraction(tempRN1, tempRN2, '+')

      const tempD1 = multiplyFraction(re2, re2)
      const tempD2 = multiplyFraction(im2, im2)
      const tempD3 = addFraction(tempD1, tempD2, '+')

      const { n: nr, d: dr } = divideFraction(tempRN3, tempD3)

      const tempIN1 = multiplyFraction(re1N, im2)
      const tempIN2 = multiplyFraction(re2, im1)
      const tempIN3 = addFraction(tempIN1, tempIN2, '+')

      const { n: ni, d: di } = divideFraction(tempIN3, tempD3)

      const result = new Numeral({
        r: (A.r * B.r + A.i * B.i) / (B.r * B.r + B.i * B.i),
        i: (B.r * A.i - A.r * B.i) / (B.r * B.r + B.i * B.i),
        nr, dr, ni, di
      })

      return await checkNumeral(result, '/')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async modulus(a, b) {
    try {
      const A = toNumeral(a)
      const B = toNumeral(b)

      if ((B.r === 0 && B.i === 0) || floor(B.r) !== B.r || floor(B.i) !== B.i) {
        throw { data: { A, B, operator: '%' }, code: 'impossibleModulo' }
      }

      // Compute division quotient of two Gaussian number in order to
      // compute its reminder according to https://bit.ly/3uPCk53 and
      // https://bit.ly/3t1RdzJ for integer numbers.

      const divResult = await Numeral.divide(a, b)
      const r = remainder({ a: A.r, b: B.r })

      const q = {
        r: parseInt(Math.round(divResult.r).toString()),
        i: parseInt(Math.round(divResult.i).toString())
      }

      const { nr, dr, ni, di } = modulusFraction(A, B, q,  r)

      const result = new Numeral({
        r: (A.i || B.i ? A.r - q.r * B.r + q.i * B.i : r),
        i: (A.i || B.i ? A.i - q.r * B.i - q.i * B.r : 0),
        nr, dr, ni, di
      })

      return await checkNumeral(result, '%')
    } catch (error) {
      return Promise.reject(error)
    }
  }
  
  static async power(a, b) {
    let result

    try {
      const A = toNumeral(a)
      const B = toNumeral(b)

      // Will be implemented soon.

      if (B.i || Math.trunc(B.r) !== B.r) {
        throw { data: { A, B, operator: '^' }, code: 'unsuportedOperation' }
      }

      if (A.r === 0 && A.i === 0) {
        result = new Numeral({
          r: B.r === 0 ? 1 : 0,
          i: 0
        })
      } else {
        const power = abs(B.r)

        let value = A

        for (let i = 1; i < power; i++) {
          value = await Numeral.multiply(value, A)
        }

        if (B.r < 0) {
          value = await Numeral.divide(1, value)
        }

        const { r, i, nr, dr, ni, di } = value

        result = new Numeral({
          r, i,
          nr, dr, ni, di
        })
      }

      return await checkNumeral(result, '^')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  print() {
    if (!this.r && !this.i) {
      return '\x1b[33;1m0\x1b[0m'
    } else {
      // Used the parseFloat(x.toPrecision(15)) to correct small floating point
      // errors that happen sometimes due to the lack of precision in Javascript
      // since we don't really need that much decimal digits. more informations on
      // https://bit.ly/2OT0qLO

      const real = parseFloat(this.r.toPrecision(Config.number.precision))
      const separatorSign = this.i < 0 ? '-' : '+'
      const imaginary = this.i < -1 || (this.i < 0 && this.i > -1) ? -parseFloat(this.i.toPrecision(Config.number.precision)) : this.i > 1 || (this.i > 0 && this.i < 1) ? parseFloat(this.i.toPrecision(Config.number.precision)) : ''

      let printedString = '\x1b[33;1m'

      if (!Config.number.fractionForm) {
        if (this.r) {
          printedString += real
        }

        if (this.r && this.i) {
          printedString += ` ${separatorSign} `
        } else if (this.i < 0) {
          printedString += separatorSign
        }

        if (this.i) {
          printedString += `${imaginary}i`
        }
      } else {
        if (this.r) {
          printedString += Number.isInteger(real) ? real : `${this.nr}/${this.dr}`
        }

        if (this.r && this.i) {
          printedString += ` ${separatorSign} `
        } else if (this.i < 0) {
          printedString += separatorSign
        }

        if (this.i) {
          printedString += Number.isInteger(imaginary) ? `${imaginary}i` : `(${abs(this.ni)} / ${this.di})i`
        }
      }

      return `${printedString}\x1b[0m`
    }
  }
}

module.exports = Numeral
