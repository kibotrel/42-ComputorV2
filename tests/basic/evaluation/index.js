const { numeralEquality, matrixEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Numerals', async () => {
    await processInput('x = 53 + 5.2i')
    const { value, type } = await processInput('x =?')
    const expectedResult = { r: 53, i: 5.2 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(type).to.be.a('string').that.equals('computation')
    expect(numeralEquality(value, expectedResult)).to.equal(true)

  })

  it('Expressions', async () => {
    await processInput('f(x) = x + 5')
    const { value, type } = await processInput('f(2i) =?')
    const expectedResult = { r: 5, i: 2 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(type).to.be.a('string').that.equals('computation')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Matrices', async () => {
    await processInput('m = [[2, 2.7 + i]]')
    const { value, type } = await processInput('m =?')
    const expectedResult = [[{ r: 2, i: 0 }, { r: 2.7, i: 1 }]]

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

    expect(matrixEquality(value.values, expectedResult))
  })
}
