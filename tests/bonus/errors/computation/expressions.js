module.exports = () => {
  it('Implicit multiplication on open bracket', async () => {
    try {
      await processInput('f(x) = x')
      await processInput('f(3)(4) =?')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'badInputFormat')
    }
  })
}