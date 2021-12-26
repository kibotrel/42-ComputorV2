const { matrixEquality } = require("../../utils/parsing.js")

module.exports = () => {
  it('Addition', async () => {
    const { value, type } = await processInput('[[ 2, 4i ]; [ 0, -2.5i + 3 ]] + [[ 21 + 0.5i, 2 ]; [2i + 4, 0.5 -i ]] =?')
    const expectedResult = [
      [{ r: 23, i: 0.5 }, { r: 2, i: 4 }],
      [{ r: 4, i: 2 }, { r: 3.5, i: -3.5 }]
    ]
    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Matrix')
    expect(value.values).to.be.an.an('array')

    for (const row of value.values) {
      expect(row).to.be.an('array')
      for (const term of row) {
        expect(term.constructor.name).to.equal('Numeral')
      }
    }

    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
  })

  it('Substraction', async () => {
    const { value, type } = await processInput('[[ 2, 4i ]; [ 0, -2.5i + 3 ]] - [[ 21 + 0.5i, 2 ]; [2i + 4, 0.5 -i ]] =?')
    const expectedResult = [
      [{ r: -19, i: -0.5 }, { r: -2, i: 4 }],
      [{ r: -4, i: -2 }, { r: 2.5, i: -1.5 }]
    ]
    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Matrix')
    expect(value.values).to.be.an.an('array')

    for (const row of value.values) {
      expect(row).to.be.an('array')
      for (const term of row) {
        expect(term.constructor.name).to.equal('Numeral')
      }
    }

    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
  })

  it('Multiplication by a scalar', async () => {
    const { value, type } = await processInput('[[ 2, 4i ]; [ 0, -2.5i + 3 ]] * 9.2 =?')
    const expectedResult = [
      [{ r: 18.4, i: 0 }, { r: 0, i: 36.8 }],
      [{ r: 0, i: 0 }, { r: 27.6, i: -23 }]
    ]
    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Matrix')
    expect(value.values).to.be.an.an('array')

    for (const row of value.values) {
      expect(row).to.be.an('array')
      for (const term of row) {
        expect(term.constructor.name).to.equal('Numeral')
      }
    }

    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
  })

  it('Multiplication by a matrix', async () => {
    const { value, type } = await processInput('[[ 2, 4i ]; [ 0, -2.5i + 3 ]] * [[ 21 + 0.5i, 2 ]; [2i + 4, 0.5 -i ]] =?')
    const expectedResult = [
      [{ r: 34, i: 17 }, { r: 8, i: 2 }],
      [{ r: 17, i: -4 }, { r: -1, i: -4.25 }]
    ]
    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Matrix')
    expect(value.values).to.be.an.an('array')

    for (const row of value.values) {
      expect(row).to.be.an('array')
      for (const term of row) {
        expect(term.constructor.name).to.equal('Numeral')
      }
    }

    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
  })
}