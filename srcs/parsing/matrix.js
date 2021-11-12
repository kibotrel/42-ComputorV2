const { numeralValue } = require('@srcs/maths/compute.js')
const Matrix = require('../classes/matrix')

module.exports = async (string) => {
  const trimmedString = string.slice(1, -1)
  const stringArrayRows = trimmedString.split(';')
  
  const matrixArray = []

  for (const row of stringArrayRows) {
    const matrixRow = []

    const trimmedRow = row.slice(1, -1)
    const stringArrayColumns = trimmedRow.split(',')

    for (const column of stringArrayColumns) {
      const value = await numeralValue(column)

      matrixRow.push(value)
    }

    matrixArray.push(matrixRow)
  }

  return new Matrix(matrixArray)
}