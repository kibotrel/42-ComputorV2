const { matrixEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Update variable value', async () => {
    await processInput('x = [[21]]')

    const { value: before } = await processInput('x =?')

    await processInput('x = [[32, i + 1]]')

    const { value: after } = await processInput('x =?')

    expect(matrixEquality(before.values, after.values)).to.equal(false)
  })

  it('Use Expression images', async () => {
    await processInput('f(x) = 2 * x * i')
    
    const { value } = await processInput('x = [[ 2 + f(2) ]]')
    const expectedResult = [[{ r: 2, i: 4 }]]

    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
  })

  it('Use stored Numerals', async () => {
    await processInput('x = 32 + i')
    
    const { value } = await processInput('x = [[ 2 + x ]]')
    const expectedResult = [[{ r: 34, i: 1 }]]

    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
  })

  it('Use both at the same time', async () => {
    await processInput('a = 2 + 0.5i')
    await processInput('f(x) = 2 * x + x / i')

    const { value } = await processInput('mat = [[ f(a), a + 4 ]]')
    const expectedResult = [[{ r: 4.5, i: -1 }, { r: 6, i: 0.5 }]]

    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
  })
}