module.exports = () => {
  it('No equal sign', async () => {
    try {
      await processInput('!solve 4 + 7x')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'notEquation')
    }
  })

  it('Multiple equal signs', async () => {
    try {
      await processInput('!solve 4 + 7x')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'notEquation')
    }
  })

  it('Invalid character', async () => {
    try {
      await processInput('!solve u = 231x')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'notEquation')
    }
  })

  it('Decimal polynom power', async () => {
    try {
      await processInput('!solve 2.1x^2.1 = 231x')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'badPolynomList')
    }
  })

  it('Negative polynom power', async () => {
    try {
      await processInput('!solve 2.1x^-2 = 231x')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'badPolynomList')
    }
  })

  it('Negative polynom power', async () => {
    try {
      await processInput('!solve 2.1x^-2 = 231x')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'badPolynomList')
    }
  })

  it('Misformated demimal number', async () => {
    try {
      await processInput('!solve 2.x^2 = 231x')
      assert.fail('FalsePositiveTest')
    } catch (error) {
      if (error instanceof AssertionError) {
        throw error
      }

      assert.equal(typeof error, 'object')
      assert.equal(error.constructor.name, 'ComputorError')
      assert.equal(error.code, 'notEquation')
    }
  })
}