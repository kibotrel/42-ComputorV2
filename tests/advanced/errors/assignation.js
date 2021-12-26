module.exports = () => {
  it('Unkown Numeral or Matrix in Numeral assignment', async () => {
    try {
      await processInput('x = t + mat * 2')
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

  it('Unkown Numeral or Matrix in Expression prototype', async () => {
    try {
      await processInput('f(x) = a + x')
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

  it('Unkown Expression in Expression prototype', async () => {
    try {
      await processInput('f(x) = g(x) + x')
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

  it('Unkown Numeral in Matrix', async () => {
    try {
      await processInput('mat = [[x]]')
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

  it('Unkown Expression in Matrix', async () => {
    try {
      await processInput('mat = [[f(x)]]')
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
