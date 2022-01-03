const fs = require('fs')

module.exports = () => {
  afterEach(() => {
    Object.assign(Config, JSON.parse(fs.readFileSync('./tests/utils/env.json')))
  })

  it('Reset everything', async () => {
    const { value } = await processInput('!reset')

    expect(value).to.be.an('object')
    expect(value).to.have.ownProperty('numNumerals')
    expect(value).to.have.ownProperty('numMatrices')
    expect(value).to.have.ownProperty('numExpressions')
    expect(value).to.have.ownProperty('numInputs')
    expect(value.numNumerals).to.equal(1)
    expect(value.numMatrices).to.equal(0)
    expect(value.numExpressions).to.equal(0)
    expect(value.numInputs).to.equal(6)
  })

  it('Reset with only Numerals', async () => {
    await processInput('x = 4')
    await processInput('y = 2')
    await processInput('z = 4i + 82')

    const { value } = await processInput('!reset')

    expect(value).to.be.an('object')
    expect(value).to.have.ownProperty('numNumerals')
    expect(value).to.have.ownProperty('numMatrices')
    expect(value).to.have.ownProperty('numExpressions')
    expect(value).to.have.ownProperty('numInputs')
    expect(value.numNumerals).to.equal(3)
    expect(value.numMatrices).to.equal(0)
    expect(value.numExpressions).to.equal(0)
    expect(value.numInputs).to.equal(4)
  })

  it('Reset with only Expressions', async () => {
    await processInput('f(x) = 4x')
    await processInput('g(y) = y - 2')
    await processInput('h(z) = 4i + 82 * z')

    const { value } = await processInput('!reset')

    expect(value).to.be.an('object')
    expect(value).to.have.ownProperty('numNumerals')
    expect(value).to.have.ownProperty('numMatrices')
    expect(value).to.have.ownProperty('numExpressions')
    expect(value).to.have.ownProperty('numInputs')
    expect(value.numNumerals).to.equal(0)
    expect(value.numMatrices).to.equal(0)
    expect(value.numExpressions).to.equal(3)
    expect(value.numInputs).to.equal(4)
  })

  it('Reset with only Matrices', async () => {
    await processInput('x = [[4]]')
    await processInput('y = [[2, 2, i + 3.1]]')
    await processInput('z = [[2, i]; [2, 0.2i]]')

    const { value } = await processInput('!reset')

    expect(value).to.be.an('object')
    expect(value).to.have.ownProperty('numNumerals')
    expect(value).to.have.ownProperty('numMatrices')
    expect(value).to.have.ownProperty('numExpressions')
    expect(value).to.have.ownProperty('numInputs')
    expect(value.numNumerals).to.equal(0)
    expect(value.numMatrices).to.equal(3)
    expect(value.numExpressions).to.equal(0)
    expect(value.numInputs).to.equal(4)
  })

  it('Reset configuration', async () => {
    await processInput('!set number.precision 6')

    const oldPrecision = Config.number.precision

    await processInput('!reset')

    const newPrecision = Config.number.precision

    expect(newPrecision).to.not.equal(oldPrecision)
  })
}