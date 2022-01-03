const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Integer as parameter', async () => {
    const { value } = await processInput('cosh(3) =?')
    const expectedResult = { r: 10.0676619958, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Decimal as parameter', async () => {
    const { value } = await processInput('cosh(1.28) =?')
    const expectedResult = { r: 1.93733851301, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Imaginary as parameter', async () => {
    const { value } = await processInput('cosh(i) =?')
    const expectedResult = { r: 0.540302305868, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Complex as parameter', async () => {
    const { value } = await processInput('cosh(1 + i) =?')
    const expectedResult = { r: 0.833730025131, i: 0.988897705763 }


    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Numeral as parameter', async () => {
    await processInput('x = 3')

    const { value } = await processInput('cosh(x) =?')
    const expectedResult = { r: 10.0676619958, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Expression image as parameter', async () => {
    await processInput('f(x) = 3x')

    const { value } = await processInput('cosh(f(1)) =?')
    const expectedResult = { r: 10.0676619958, i: 0 }


    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}