const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Implicit multiplication on open bracket', async () => {
    const { value } = await processInput('4(5 + 2) =?')
    const expectedResult = { r: 28, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Implicit multiplication between set of brackets', async () => {
    const { value } = await processInput('(3 + 7)(2 + 8) =?')
    const expectedResult = { r: 100, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Unary operator on numbers', async () => {
    const { value } = await processInput('4 - (-7) =?')
    const expectedResult = { r: 11, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}