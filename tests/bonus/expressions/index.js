const { numeralEquality, matrixEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Implicit multiplication on Numeral factor', async () => {
    await processInput('y = 3')
    await processInput('f(x) = 3y + x')
    const { value } = await processInput('f(3) =?')
    const expectedResult = { r: 12, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Implicit multiplication on Matrix factor', async () => {
    await processInput('x = [[2i + 7]]')

    const { value } = await processInput('3x =?')
    const expectedResult = [[{ r: 21, i: 6 }]]

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Matrix')
    expect(value.values).to.be.an.an('array')
    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
  })

  it('Implicit multiplication on Expression image factor', async () => {
    await processInput('f(x) = x - 7')
    const { value } = await processInput('-4f(4) =?')
    const expectedResult = { r: 12, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Implicit multiplication on open bracket', async () => {
    const { value } = await processInput('4(5 + 2) =?')
    const expectedResult = { r: 28, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Implicit multiplication between set of brackets', async () => {
    const { value } = await processInput('(3 + 7)(2 + 8) =?')
    const expectedResult = { r: 100, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Unary operator on numbers', async () => {
    const { value } = await processInput('4 - (-7) =?')
    const expectedResult = { r: 11, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Unary operator on Numeral', async () => {
    await processInput('x = 4')
    const { value } = await processInput('3 + (-x) =?')
    const expectedResult = { r: -1, i: 0 }

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Unary operator on Matrix', async () => {
    await processInput('x = [[ -2, 4i ]]')
    const { value } = await processInput('-x =?')
    const expectedResult = [[{ r: 2, i: 0 }, { r: 0, i: -4}]]

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Matrix')
    expect(value.values).to.be.an.an('array')
    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
  })
}