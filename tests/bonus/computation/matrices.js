const { matrixEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Implicit multiplication on factor', async () => {
    await processInput('x = [[2i + 7]]')

    const { value } = await processInput('3x =?')
    const expectedResult = [[{ r: 21, i: 6 }]]

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Matrix')
    expect(value.values).to.be.an.an('array')
    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
  })

  it('Implicit multiplication on open bracket', async () => {
    await processInput('mat = [[2i + 7]]')

    const { value } = await processInput('mat(3 + 2) =?')
    const expectedResult = [[{ r: 35, i: 10 }]]

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Matrix')
    expect(value.values).to.be.an.an('array')
    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
  })

  it('Unary operator', async () => {
    await processInput('x = [[ -2, 4i ]]')
    const { value } = await processInput('-x =?')
    const expectedResult = [[{ r: 2, i: 0 }, { r: 0, i: -4}]]

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Matrix')
    expect(value.values).to.be.an.an('array')
    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
  })
}