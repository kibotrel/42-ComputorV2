const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  it('Multiple different operators', async () => {
    const { value, type } = await processInput('7i / 2 + 5.2 - 7 ^ 4 =?')
    const expectedResult = { r: -2395.8, i: 3.5 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Lots of blank characters', async () => {
    const { value, type } = await processInput('           6 - 78 /            i     - 1 =?')
    const expectedResult = { r: 5, i: 78 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Shallow operating priorities', async () => {
    const { value, type } = await processInput('2 * (4.5 + i) =?')
    const expectedResult = { r: 9, i: 2 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Deep operating priorities', async () => {
    const { value, type } = await processInput('(7i - (6 + 5i * ((2 + (4 * (2i + 0.6i) - 2.25) * 4 + 8)) / (2 * i)) + 2) =?')
    const expectedResult = { r: -6.5, i: -97 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}