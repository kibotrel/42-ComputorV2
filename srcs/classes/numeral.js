const { checkNumeral, toNumeral, numeralFractionalParts } = require('@srcs/maths/utils.js')
const { decimalToIntegerScaling, addFraction, multiplyFraction, divideFraction } = require('@srcs/maths/fractions.js')

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
      const A = await toNumeral(a)
      const B = await toNumeral(b)

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
      const A = await toNumeral(a)
      const B = await toNumeral(b)
      
      const { re: re1, im: im1 } = numeralFractionalParts(A)
      const { re: re2, im: im2 } = numeralFractionalParts(B)

      const { n: nr, d: dr } = addFraction(re1, re2, '-')
      const { n: ni, d: di } = addFraction(im1, im2, '-')

      const result = new Numeral({
        r: A.r - B.r,
        i: B.i - B.i,
        nr, dr, ni, di
      })

      return await checkNumeral(result, '-')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async multiply(a, b) {
    try {
      const A = await toNumeral(a)
      const B = await toNumeral(b)
      
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
      const A = await toNumeral(a)
      const B = await toNumeral(b)
      
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
        i: (-A.r * B.i + B.r * A.i) / (B.r * B.r + B.i * B.i),
        nr, dr, ni, di
      })

      return await checkNumeral(result, '/')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async modulus(a, b) {
    try {
      const A = await toNumeral(a)
      const B = await toNumeral(b)

      if (B.r === 0 && B.i === 0) {
        throw { data: { A, B, operator: '%' }, code: 'impossibleModulo' }
      }
      
      // divise num par denom ensuite mod puis intRescale et simplify
      // Can convert to (x * (n/d)) mod y to avoid repeating decimals etc...

      const result = new Numeral({
        r: A.r % B.r,
        i: 0
      })

      return await checkNumeral(result, '%')
    } catch (error) {
      return Promise.reject(error)
    }
  }
  
  static async power(x, n) {
    let result

    try {
      if ((x.constructor.name === 'Numeral' && x.i) || (n.constructor.name === 'Numeral' && n.r % 1 && !n.i) || (n.constructor.name === 'Number' && n % 1)) {
        throw { data: { x, n, operator: '^' }, code: 'unsuportedOperation' } // Will be implemented
      } else if (n.constructor.name === 'Numeral' && n.i) {
        throw { data: { x, n, operator: '^' }, code: 'invalidOperation' }
      }

      x = x.r !== undefined ? x.r : x
      n = n.r !== undefined ? n.r : n

      if (x === 0) {
        result = new Numeral({
          r: n === 0 ? 1 : 0,
          i: 0
        })
      } else {
        const absolutePower = n < 0 ? -n : n
        let total = 1

        for (let i = 1; i <= absolutePower; i++) {
          total *= x
        }

        result = new Numeral({
          r: n < 0 ? 1 / total : total,
          i: 0
        })
      }

      return await checkNumeral(result, '^')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  print() {
    if (!this.r && !this.i) {
      return '\x1b[33m0\x1b[0m'
    } else {
      // Used the parseFloat(x.toPrecision(15)) to correct small floating point
      // errors that happen sometimes due to the lack of precision in Javascript
      // since we don't really need that much decimal digits. more informations on
      // https://bit.ly/2OT0qLO

      const real = parseFloat(this.r.toPrecision(Config.floatPrecision))
      const separatorSign = this.i < 0 ? '-' : '+'
      const imaginary = this.i < -1 || (this.i < 0 && this.i > -1) ? -parseFloat(this.i.toPrecision(Config.floatPrecision)) : this.i > 1 || (this.i > 0 && this.i < 1) ? parseFloat(this.i.toPrecision(Config.floatPrecision)) : ''

      return `${this.r ? real : ''}${this.r && this.i ? ` ${separatorSign} ` : this.i < 0 ? separatorSign : ''}${this.i ? `${imaginary}i` : ''}`
    }
  }
}

module.exports = Numeral
