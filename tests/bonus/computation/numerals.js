const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Implicit multiplication on factor', async () => {
    await processInput('x = 2i + 7')

    const { value } = await processInput('3x =?')
    const expectedResult = { r: 21, i: 6 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Implicit multiplication on open bracket', async () => {
    await processInput('x = 4')
    const { value } = await processInput('x(2 + 3) =?')
    const expectedResult = { r: 20, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Unary operator', async () => {
    await processInput('x = 4')
    const { value } = await processInput('3 + (-x) =?')
    const expectedResult = { r: -1, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}