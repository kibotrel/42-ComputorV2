const { numeralEquality, matrixEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Implicit multiplication on factor', async () => {
    await processInput('f(x) = x - 7')

    const { value } = await processInput('-4f(4) =?')
    const expectedResult = { r: 12, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Unary operator', async () => {
    await processInput('f(x) = 3 * x')

    const { value } = await processInput('4 + (-f(2)) =?')
    const expectedResult = { r: -2, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Compute Expression parameter (Literal)', async () => {
    await processInput('f(x) = 3 * x')

    const { value } = await processInput('9 + f(3i + 2) =?')
    const expectedResult = { r: 15, i: 9 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Compute Expression parameter (with Numeral)', async () => {
    await processInput('y = 2')
    await processInput('f(x) = 3 * x')

    const { value } = await processInput('9 + f(3i + y) =?')
    const expectedResult = { r: 15, i: 9 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
  
  it('Compute Expression parameter (with Matrix)', async () => {
    await processInput('y = [[2]]')
    await processInput('f(x) = 3 * x')

    const { value } = await processInput('4 * f(2y) =?')
    const expectedResult = [[{ r: 48, i: 0 }]]

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Matrix')
    expect(value.values).to.be.an.an('array')
    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
  })

  it('Compute Expression parameter (with Expression image)', async () => {
    await processInput('f(x) = 4 + 2x')
    await processInput('g(x) = x + 3i')

    const { value } = await processInput('4 * f(2 + g(4)) =?')
    const expectedResult = { r: 64, i: 24 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}