const { trueValue } = require('../../utils/maths.js')

module.exports = () => {
  it('Addition', async () => {
    const { value, type } = await processInput('24.7 + 0.6 + 3.75 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(29.05)
  })

  it('Substraction', async () => {
    const { value, type } = await processInput('28.8 - 0.072 - 3.1 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(25.628)
  })

  it('Multiplication', async () => {
    const { value, type } = await processInput('5.12 * 2.91 * 9.2 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(137.07264)
  })

  it('Division', async () => {
    const { value, type } = await processInput('8.2 / 2.5 / 0.64 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(5.125)
  })

  it('Modulus', async () => {
    const { value, type } = await processInput('29.8 % 4 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(1.8)
  })

  it('Power', async () => {
    const { value, type } = await processInput('2.81 ^ 4 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(62.34839521)
  })
}