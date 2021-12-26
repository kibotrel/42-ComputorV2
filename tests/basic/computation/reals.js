const { numeralEquality } = require("../../utils/parsing.js")

module.exports = () => {
  it('Addition', async () => {
    const { value, type } = await processInput('24.7 + 0.6 + 3.75 =?')
    const expectedResult = { r: 29.05, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Substraction', async () => {
    const { value, type } = await processInput('28.8 - 0.072 - 3.1 =?')
    const expectedResult = { r: 25.628, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Multiplication', async () => {
    const { value, type } = await processInput('5.12 * 2.91 * 9.2 =?')
    const expectedResult = { r: 137.07264, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Division', async () => {
    const { value, type } = await processInput('8.2 / 2.5 / 0.64 =?')
    const expectedResult = { r: 5.125, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Modulus', async () => {
    const { value, type } = await processInput('29.8 % 4 =?')
    const expectedResult = { r: 1.8, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Power', async () => {
    const { value, type } = await processInput('2.81 ^ 4 =?')
    const expectedResult = { r: 62.34839521, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}