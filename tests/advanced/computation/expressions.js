const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Use stored Expressions', async () => {
    await processInput('f(x) = 2 * x + 9.5')
    await processInput('g(x) = x / i')
    await processInput('h(x) = 2 ^ x')

    const { value, type } = await processInput('f(2) + g(2i) * h(8) =?')
    const expectedResult = { r: 525.5, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Use stored Numerals as Expressions parameters', async () => {
    await processInput('f(x) = 2 * x + 9.5')
    await processInput('x = 4')

    const { value, type } = await processInput('f(x) =?')
    const expectedResult = { r: 17.5, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}