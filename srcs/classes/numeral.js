const { checkNumeral } = require('@srcs/maths/utils.js')

class Numeral {
  constructor({r, i, nr, ni, d }) {
    this.r = r
    this.i = i
    // this.rNumerator = nr === undefined ? r : nr
    // this.iNumerator = ni === undefined ? i : ni
    // this.denominator = d === undefined ? 1 : d
  }

  static async add(a, b) {
    let result

    try {
      if (a.constructor.name === 'Number' && b.constructor.name === 'Number') {
        result = new Numeral({
          r: a + b,
          i: 0
        })
      } else if (a.constructor.name === 'Numeral' && b.constructor.name === 'Numeral') {
        result = new Numeral({
          r: a.r + b.r,
          i: a.i + b.i
        })
      } else if (a.constructor.name === 'Numeral' && b.constructor.name === 'Number') {
        result = new Numeral({
          r: a.r + b,
          i: a.i
        })
      } else if (a.constructor.name === 'Number' && b.constructor.name === 'Numeral') {
        result = new Numeral({
          r: a + b.r,
          i: b.i 
        })
      }

      return await checkNumeral(result, '+')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async substract(a, b) {
    let result

    try {
      if (a.constructor.name === 'Number' && b.constructor.name === 'Number') {
        result = new Numeral({
          r: a - b,
          i: 0
        })
      } else if (a.constructor.name === 'Numeral' && b.constructor.name === 'Numeral') {
        result = new Numeral({
          r: a.r - b.r,
          i: a.i - b.i
        })
      } else if (a.constructor.name === 'Numeral' && b.constructor.name === 'Number') {
        result = new Numeral({
          r: a.r - b,
          i: a.i
        })
      } else if (a.constructor.name === 'Number' && b.constructor.name === 'Numeral') {
        result = new Numeral({
          r: a - b.r,
          i: -b.i
        })
      }

      return await checkNumeral(result, '-')
    } catch (error) {
      return Promise.reject(error)
    }
  } 
  static async multiply(a, b) {
    let result

    try {
      if (a.constructor.name === 'Number' && b.constructor.name === 'Number') {
        result = new Numeral({
          r: a * b,
          i: 0
        })
      } else if (a.constructor.name === 'Numeral' && b.constructor.name === 'Numeral') {
        result = new Numeral({
          r: a.r * b.r - a.i * b.i,
          i: a.r * b.i + a.i * b.r
        })
      } else if (a.constructor.name === 'Numeral' && b.constructor.name === 'Number') {
        result = new Numeral({
          r: a.r * b,
          i: a.i * b
        })
      } else if (a.constructor.name === 'Number' && b.constructor.name === 'Numeral') {
        result = new Numeral({
          r: a * b.r,
          i: a * b.i
        })
      }

      return await checkNumeral(result, '*')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async divide(a, b) {
    let result

    try {
      if ((b.constructor.name === 'Number' && b === 0) || (b.constructor.name === 'Numeral' && b.r === 0 && b.i === 0)) {
        throw { code: 'impossibleDivision' }
      }

      if (a.constructor.name === 'Number' && b.constructor.name === 'Number') {
        result = new Numeral({
          r: a / b,
          i: 0
        })
      } else if (a.constructor.name === 'Numeral' && b.constructor.name === 'Numeral') {
        result = new Numeral({
          r: (a.r * b.r + a.i * b.i) / (b.r * b.r + b.i * b.i),
          i: (-a.r * b.i + b.r * a.i) / (b.r * b.r + b.i * b.i)
        })
      } else if (a.constructor.name === 'Numeral' && b.constructor.name === 'Number') {
        result = new Numeral({
          r: a.r / b,
          i: a.i / b
        })
      } else if (a.constructor.name === 'Number' && b.constructor.name === 'Numeral') {
        result = new Numeral({
          r: (a * b.r) / (b.r * b.r + b.i * b.i),
          i: (-a * b.i) / (b.r * b.r + b.i * b.i)
        })
      }

      return await checkNumeral(result, '/')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async modulus(a, b) {
    let result

    try {
      if ((a.constructor.name !== 'Number' && a.i) || (b.constructor.name !== 'Number' && b.i) || b % 1) {
        throw { data: { a, b, operator: '%' }, code: 'unsuportedOperation' }
      }

      if (a.constructor.name === 'Number' && b.constructor.name === 'Number') {
        result = new Numeral({
          r: a % b,
          i: 0
        })
      } else if (a.constructor.name === 'Numeral' && b.constructor.name === 'Numeral') {
        result = new Numeral({
          r: a.r % b.r,
          i: 0
        })
      } else if (a.constructor.name === 'Numeral' && b.constructor.name === 'Number') {
        result = new Numeral({
          r: a.r % b,
          i: 0
        })
      } else if (a.constructor.name === 'Number' && b.constructor.name === 'Numeral') {
        result = new Numeral({
          r: a % b.r,
          i: 0
        })
      }

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
    return `\x1b[33m${this.r}${this.i < 0 ? ` - ${-this.i} * i` : this.i > 0 ? ` + ${this.i} * i` : ''}\x1b[0m`
  }
}

module.exports = Numeral
