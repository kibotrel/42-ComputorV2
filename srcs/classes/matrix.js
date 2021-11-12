class Matrix {
  constructor(array) {
    this.values = array
    this.rows = array.length
    this.columns = array[0].length
  }

  static async add(a, b) {
    try {
      if (a.rows !== b.rows || a.columns !== b.columns) {
        throw new ComputorError({ code: 'matrixWrongDimensions' })
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
        throw new ComputorError({ code: 'matrixWrongDimensions' })
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

  static async multiply(a, b) {
    try {
      const newArray = []

      if (a.constructor.name !== b.constructor.name) {
        const factor = (a.constructor.name === 'Matrix' ? b : a)
        const matrix = (a.constructor.name === 'Matrix' ? a : b)
        const { rows, columns } = (a.constructor.name === 'Matrix' ? a : b)

        for (let i = 0; i < rows; i++) {
          const newRow = []

          for (let j = 0; j < columns; j++) {
            newRow.push(await Numeral.multiply(factor, matrix.values[i][j]))
          }

          newArray.push(newRow)
        }
      } else {
        if (a.columns !== b.rows) {
          throw new ComputorError({ code: 'matrixWrongDimensions' })
        }

        for (let i = 0; i < a.rows; i++) {
          const newRow = []

          for (let j = 0; j < b.columns; j++) {
            let value = 0

            for (let k = 0; k < b.rows; k++) {
              value = await Numeral.add(value, await Numeral.multiply(a.values[i][k], b.values[k][j]))
            }

            newRow.push(value)
          }
          newArray.push(newRow)
        }
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

    return array.join('\n\t')
  }
}

module.exports = Matrix