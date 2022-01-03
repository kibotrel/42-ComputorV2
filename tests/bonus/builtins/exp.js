const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Integer as parameter', async () => {
    const { value } = await processInput('exp(1) =?')
    const expectedResult = { r: 2.7182818262, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Decimal as parameter', async () => {
    const { value } = await processInput('exp(1.26) =?')
    const expectedResult = { r: 3.52542145038, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Imaginary as parameter', async () => {
    const { value } = await processInput('exp(i) =?')
    const expectedResult = { r: 0.540302303792, i: 0.841470984648 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Complex as parameter', async () => {
    const { value } = await processInput('exp(1 + i) =?')
    const expectedResult = { r: 1.46869408369, i: 2.28735529902 }


    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Numeral as parameter', async () => {
    await processInput('x = 1')
    const { value } = await processInput('exp(x) =?')
    const expectedResult = { r: 2.7182818262, i: 0 }


    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Expression image as parameter', async () => {
    await processInput('f(x) = 3x')
    const { value } = await processInput('exp(f(0.27)) =?')
    const expectedResult = { r: 2.2479079865, i: 0 }


    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}