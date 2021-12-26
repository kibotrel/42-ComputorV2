const { numeralEquality } = require("../../utils/parsing.js")

module.exports = () => {
  it('Addition', async () => {
    const { value, type } = await processInput('19 + 5 + 4 =?')
    const expectedResult = { r: 28, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Substraction', async () => {
    const { value, type } = await processInput('12 - 9 - 5 - 2 =?')
    const expectedResult = { r: -4, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Multiplication', async () => {
    const { value, type } = await processInput('2 * 8 * 4 =?')
    const expectedResult = { r: 64, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Division', async () => {
    const { value, type } = await processInput('24 / 8 =?')
    const expectedResult = { r: 3, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Modulus', async () => {
    const { value, type } = await processInput('24 % 9 % 4 =?')
    const expectedResult = { r: 2, i: 0 }
  
    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Power', async () => {
    const { value, type } = await processInput('9 ^ 3 =?')
    const expectedResult = { r: 729, i: 0 }
  
    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}