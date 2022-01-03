const { numeralEquality, matrixEquality } = require('../../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('More than one parameter', async () => {
    await processInput('f(x, y) = x + y')

    const { value } = await processInput('f(3, 9) =?')
    const expectedResult = { r: 12, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}