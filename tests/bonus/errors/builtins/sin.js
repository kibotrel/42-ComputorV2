module.exports = () => {
  it('No parameters', async () => {
    try {
      await processInput('sin() =?')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'incorrectParameterAmount')
    }
  })

  it('More than one parameter', async () => {
    try {
      await processInput('sin(5, 5) =?')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'incorrectParameterAmount')
    }
  })

  it('Matrix as parameter', async () => {
    try {
      await processInput('sin([[2]]) =?')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'builtinNotHandledOperator')
    }
  })
}