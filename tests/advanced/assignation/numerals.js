const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Update variable value', async () => {
    await processInput('x = 2')

    const { value: before } = await processInput('x =?')

    await processInput('x = 92.1i')

    const { value: after } = await processInput('x =?')

    expect(numeralEquality(before, after)).to.equal(false)
  })

  it('Use Expression images', async () => {
    await processInput('f(x) = 2 * x * i')
    
    const { value } = await processInput('x = f(3) + 5')
    const expectedResult = { r: 5, i: 6 }

    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })
}