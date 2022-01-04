module.exports = () => {
  it('No parameters', async () => {
    try {
      await processInput('ln() =?')
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
      await processInput('ln(5, 5) =?')
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

  it('Negative number as parameter', async () => {
    try {
      await processInput('ln(-3) =?')
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

  it('Zero as parameter', async () => {
    try {
      await processInput('ln(0) =?')
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

  it('Imaginary as parameter', async () => {
    try {
      await processInput('ln(i) =?')
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
      await processInput('ln(3 + 2i) =?')
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
      await processInput('ln([[2]]) =?')
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