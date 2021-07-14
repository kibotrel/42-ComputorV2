const Numeral = require("./numeral")

class Matrix {
  constructor(array) {
    this.values = array
    this.rows = array.length
    this.columns = array[0].length
  }

  static async add(a, b) {
    try {
      if (a.rows !== b.rows || a.columns !== b.columns) {
        throw { data: { a, b }, code: 'matrixWrongDimensions' }
      }

      const { rows, columns } = a
      const newArray = []

      for (let i = 0; i < rows; i++) {
        const newRow = []

        for (let j = 0; j < columns; j++) {
          newRow.push(await Numeral.add(a.values[i][j], b.values[i][j]))
        }

        newArray.push(newRow)
      }

      return new Matrix(newArray)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async substract(a, b) {
    try {
      if (a.rows !== b.rows || a.columns !== b.columns) {
        throw { data: { a, b }, code: 'matrixWrongDimensions' }
      }

      const { rows, columns } = a
      const newArray = []

      for (let i = 0; i < rows; i++) {
        const newRow = []

        for (let j = 0; j < columns; j++) {
          newRow.push(await Numeral.substract(a.values[i][j], b.values[i][j]))
        }

        newArray.push(newRow)
      }

      return new Matrix(newArray)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  print() {
    const array = []

    for (let i = 0; i < this.rows; i++) {
      const row = []

      for (let j = 0; j < this.columns; j++) {
        row.push(this.values[i][j].print())
      }

      array.push(`[ ${row.join(', ')} ]`)
    }

    console.log(array.join('\n'))
  }
}

module.exports = Matrix