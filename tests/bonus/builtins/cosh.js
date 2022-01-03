const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Integer as parameter', async () => {
    const { value } = await processInput('sinh(3) =?')
    const expectedResult = { r: 10.0178749274, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Decimal as parameter', async () => {
    const { value } = await processInput('sinh(1.28) =?')
    const expectedResult = { r: 1.65930121256, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Imaginary as parameter', async () => {
    const { value } = await processInput('sinh(i) =?')
    const expectedResult = { r: 0, i: 0.841470984808 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Complex as parameter', async () => {
    const { value } = await processInput('sinh(1 + i) =?')
    const expectedResult = { r: 0.634963914785, i: 1.29845758142 }


    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Numeral as parameter', async () => {
    await processInput('x = 3')

    const { value } = await processInput('sinh(x) =?')
    const expectedResult = { r: 10.0178749274, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Expression image as parameter', async () => {
    await processInput('f(x) = 3x')

    const { value } = await processInput('sinh(f(1)) =?')
    const expectedResult = { r: 10.0178749274, i: 0 }


    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}