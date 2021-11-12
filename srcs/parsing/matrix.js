const { numeralValue } = require('@srcs/maths/compute.js')

module.exports = async (string) => {
  try {
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

    let rowSize = matrixArray[0].length

    for (const row of matrixArray) {
      if (row.length != rowSize) {
        throw new ComputorError({ code: 'notMatrix' })
      }
    }

    return new Matrix(matrixArray)
  } catch (error) {
    return Promise.reject(error)
  }
}