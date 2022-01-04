module.exports = () => {
  it('No parameters', async () => {
    try {
      await processInput('sqrt() =?')
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
      await processInput('sqrt(5, 5) =?')
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

  it('Imaginary as parameter', async () => {
    try {
      await processInput('sqrt(2i) =?')
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

  it('Complex as parameter', async () => {
    try {
      await processInput('sqrt(5 + 2i) =?')
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

  it('Matrix as parameter', async () => {
    try {
      await processInput('sqrt([[2]]) =?')
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