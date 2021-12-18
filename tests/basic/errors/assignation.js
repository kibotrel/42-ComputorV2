module.exports = () => {
  it('Assign something to i', async () => {
    try {
      await processInput('i = 42')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'forbiddenVariableName')
    }
  })

  it('Invalid characters', async () => {
    try {
      await processInput('x = #')
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

  it('Multiple equal signs', async () => {
    try {
      const { type } = await processInput('x == 2')
      console.log(type)
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

  it('Invalid variable name', async () => {
    try {
      await processInput('s3x = 69')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'invalidVariableFormat')
    }
  })

  it('Use variable that is not parameter in Expression prototype', async () => {
    try {
      await processInput('f(x) = a + 8.2')
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

  it('Misformated Numeral', async () => {
    try {
      await processInput('test = 6.')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'misformattedFloat')
    }
  })

  it('Misformated Expression', async () => {
    try {
      await processInput('f(x = 3 + x')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'invalidVariableFormat')
    }
  })

  it('Misformated Matrix', async () => {
    try {
      await processInput('test = [[2')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'misformattedMatrix')
    }
  })
}
