const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Use stored Numerals', async () => {
    await processInput('a = 25.5 + 8i')
    await processInput('b = 2 - 2i')
    await processInput('c = 74 % 7')

    const { value, type } = await processInput('a / b + c =?')
    const expectedResult = { r: 8.375, i: 8.375 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}
