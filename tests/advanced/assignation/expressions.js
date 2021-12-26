const { arrayEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Update variable value', async () => {
    const { value: before } = await processInput('f(x) = x + 2')
    const { value: after } = await processInput('f(x) = x / 5')

    expect(arrayEquality(before.definition, after.definition)).to.equal(false)
  })

  it('Use stored Numerals', async () => {
    await processInput('x = 21')

    const { value } = await processInput('f(a) = x + 2')

    expect(value.definition.indexOf('x')).to.equal(-1)
  })

  it('Use stored Matrix', async () => {
    await processInput('mat = [[2 + 4i]]')

    const { value } = await processInput('f(x) = mat * 2')

    expect(value.definition.indexOf('[[2 + 4i]]')).to.equal(0)
  })

  it('Updating used Numerals don\'t update prototype', async () => {
    await processInput('x = 21')

    const { value } = await processInput('f(a) = x + 2')

    await processInput('x = 42')
    expect(arrayEquality(Variables[1].value.definition, value.definition)).to.equal(true)
  })

  it('Updating used Matrices don\'t update prototype', async () => {
    await processInput('mat = [[9.1 + 0.2i]]')

    const { value } = await processInput('f(a) = mat + 8.321')

    await processInput('mat = 42')
    expect(arrayEquality(Variables[1].value.definition, value.definition)).to.equal(true)
  })
}