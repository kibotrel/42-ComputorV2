const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Integer as parameter', async () => {
    const { value } = await processInput('cos(9) =?')
    const expectedResult = { r: -0.911130261885, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Decimal as parameter', async () => {
    const { value } = await processInput('cos(1.28) =?')
    const expectedResult = { r: 0.286715209632, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Imaginary as parameter', async () => {
    const { value } = await processInput('cos(i) =?')
    const expectedResult = { r: 1.54308063482, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Complex as parameter', async () => {
    const { value } = await processInput('cos(1 + i) =?')
    const expectedResult = { r: 0.833730025131, i: -0.988897705763 }


    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Numeral as parameter', async () => {
    await processInput('x = 3')

    const { value } = await processInput('cos(x) =?')
    const expectedResult = { r: -0.989992496601, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Expression image as parameter', async () => {
    await processInput('f(x) = 3x')

    const { value } = await processInput('cos(f(1)) =?')
    const expectedResult = { r: -0.989992496601, i: 0 }


    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}