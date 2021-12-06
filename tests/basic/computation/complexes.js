const { trueValue } = require('../../utils/maths.js')

module.exports = () => {
  it('Addition', async () => {
    const { value, type } = await processInput('24.2i + 4 + 3.75i =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(value.r).to.be.equal(4)
    expect(trueValue(value.i)).to.be.equal(27.95)
  })

  it('Substraction', async () => {
    const { value, type } = await processInput('22.8i - 0.02 - 3.1i =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(-0.02)
    expect(trueValue(value.i)).to.be.equal(19.7)
  })

  it('Multiplication', async () => {
    const { value, type } = await processInput('9.7i * 5.8 * 6.02i =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(-338.6852)
    expect(value.i).to.be.equal(0)
  })

  it('Division', async () => {
    const { value, type } = await processInput('25.2i / 5i =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(5.04)
    expect(value.i).to.be.equal(0)
  })

  it('Modulus', async () => {
    const { value, type } = await processInput('71.7 % 4i =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(-0.3)
    expect(value.i).to.be.equal(0)
  })

  it('Power', async () => {
    const { value, type } = await processInput('2.81 ^ 4 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(62.34839521)
  })
}