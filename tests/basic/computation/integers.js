module.exports = () => {
  it('Addition', async () => {
    const { value, type } = await processInput('19 + 5 + 4 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(value.r).to.be.equal(28)
  })

  it('Substraction', async () => {
    const { value, type } = await processInput('12 - 9 - 5 - 2 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(value.r).to.be.equal(-4)
  })

  it('Multiplication', async () => {
    const { value, type } = await processInput('2 * 8 * 4 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(value.r).to.be.equal(64)
  })

  it('Division', async () => {
    const { value, type } = await processInput('24 / 8 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(value.r).to.be.equal(3)
  })

  it('Modulus', async () => {
    const { value, type } = await processInput('24 % 9 % 4 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(value.r).to.be.equal(2)
  })

  it('Power', async () => {
    const { value, type } = await processInput('9 ^ 3 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(value.r).to.be.equal(729)
  })
}