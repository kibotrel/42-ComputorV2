module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Use unkown Numeral or Matrix', async () => {
    try {
      await processInput('a + 4 =?')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'unknownVariable')
    }
  })

  it('Use unkown Expression', async () => {
    try {
      await processInput('f(2) =?')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'unknownVariable')
    }
  })
}
