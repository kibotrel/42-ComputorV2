const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  it('Addition', async () => {
    const { value, type } = await processInput('24.2i + 4 + 3.75i =?')
    const expectedResult = { r: 4, i: 27.95 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Substraction', async () => {
    const { value, type } = await processInput('22.8i - 0.02 - 3.1i =?')
    const expectedResult = { r: -0.02, i: 19.7 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Multiplication', async () => {
    const { value, type } = await processInput('9.7i * 5.8 * 6.02i =?')
    const expectedResult = { r: -338.6852, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Division', async () => {
    const { value, type } = await processInput('25.2i / 5i =?')
    const expectedResult = { r: 5.04, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Modulus', async () => {
    const { value, type } = await processInput('71.7 % 4i =?')
    const expectedResult = { r: -0.3, i: 0 }

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