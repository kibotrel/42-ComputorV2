const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Integer as parameter', async () => {
    const { value } = await processInput('ln(1) =?')
    const expectedResult = { r: 0, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Decimal as parameter', async () => {
    const { value } = await processInput('ln(1.1) =?')
    const expectedResult = { r: 0.095310179804, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Numeral as parameter', async () => {
    await processInput('x = 1')

    const { value } = await processInput('ln(x) =?')
    const expectedResult = { r: 0, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Expression image as parameter', async () => {
    await processInput('f(x) = x')

    const { value } = await processInput('ln(f(1)) =?')
    const expectedResult = { r: 0, i: 0 }


    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}