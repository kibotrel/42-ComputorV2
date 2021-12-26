const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Lots of blank characters', async () => {
    const { value } = await processInput('x =   2  + 3')
    const expectedResult = { r: 5, i: 0 }

    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Case insensitivity', async () => {
    await processInput('variable = 7')

    const { value } = await processInput('VaRiABle =?')
    const expectedResult = { r: 7, i: 0 }

    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Reassign variable to another type', async () => {
    const { value: before } = await processInput('x = [[ 2,0 ]; [2.8 + i, -0.72 ]]')

    await processInput('x = 3')

    const { value: after } = await processInput('x =?')

    expect(before.constructor.name).to.not.equal(after.constructor.name)
  })
}