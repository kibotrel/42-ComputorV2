const { numeralEquality, matrixEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Multiple different operators', async () => {
    const { value, type } = await processInput('7i / 2 + 5.2 - 7 ^ 4 =?')
    const expectedResult = { r: -2395.8, i: 3.5 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Lots of blank characters', async () => {
    const { value, type } = await processInput('           6 - 78 /            i     - 1 =?')
    const expectedResult = { r: 5, i: 78 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Shallow operating priorities', async () => {
    const { value, type } = await processInput('2 * (4.5 + i) =?')
    const expectedResult = { r: 9, i: 2 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Deep operating priorities', async () => {
    const { value, type } = await processInput('(7i - (6 + 5i * ((2 + (4 * (2i + 0.6i) - 2.25) * 4 + 8)) / (2 * i)) + 2) =?')
    const expectedResult = { r: -6.5, i: -97 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })


  it('Use stored Numerals', async () => {
    await processInput('a = 25.5 + 8i')
    await processInput('b = 2 - 2i')
    await processInput('c = 74 % 7')

    const { value, type } = await processInput('a / b + c =?')
    const expectedResult = { r: 8.375, i: 8.375 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Use stored Expressions', async () => {
    await processInput('f(x) = 2 * x + 9.5')
    await processInput('g(x) = x / i')
    await processInput('h(x) = 2 ^ x')

    const { value, type } = await processInput('f(2) + g(2i) * h(8) =?')
    const expectedResult = { r: 525.5, i: 0 }

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Numeral')
    expect(numeralEquality(value, expectedResult)).to.equal(true)
  })

  it('Use stored Matrices', async () => {
    await processInput('m = [[ 2,0 ]; [2.8 + i, -0.72 ]]')
    await processInput('n = [[ 4i,-1 +5.6i]; [ -6,1 ]]')

    const { value, type } = await processInput('m + n =?')
    const expectedResult = [
      [{ r: 2, i: 4 }, { r: -1, i: 5.6 }],
      [{ r: -3.2, i: 1}, { r: 0.28, i: 0 }]
    ]
  
    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Matrix')
    expect(value.values).to.be.an.an('array')

    for (const row of value.values) {
      expect(row).to.be.an('array')
      for (const term of row) {
        expect(term.constructor.name).to.equal('Numeral')
      }
    }

    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
    })
}
