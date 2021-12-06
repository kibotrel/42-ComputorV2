const { trueValue } = require('../../utils/maths.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Numerals', async () => {
    await processInput('x = 53 + 5.2i')
    const { value, type } = await processInput('x =?')

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.r).to.be.equal(53)
    expect(trueValue(value.i)).to.be.equal(5.2)

  })

  it('Expressions', async () => {
    await processInput('f(x) = x + 5')
    const { value, type } = await processInput('f(2i) =?')

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.r).to.be.equal(5)
    expect(value.i).to.be.equal(2)
  })

  it('Matrices', async () => {
    await processInput('m = [[2, 2.7 + i]]')
    const { value, type } = await processInput('m =?')

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Matrix')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.values[0][0].constructor.name).to.be.equal('Numeral')
    expect(value.values[0][1].constructor.name).to.be.equal('Numeral')
    expect(value.values[0][0].r).to.be.equal(2)
    expect(value.values[0][0].i).to.be.equal(0)
    expect(trueValue(value.values[0][1].r)).to.be.equal(2.7)
    expect(value.values[0][1].i).to.be.equal(1)
  })
}
