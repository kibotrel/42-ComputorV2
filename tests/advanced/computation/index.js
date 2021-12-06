const { trueValue } = require('../../utils/maths.js')
module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Multiple different operators', async () => {
    const { value, type } = await processInput('7i / 2 + 5.2 - 7 ^ 4 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(-2395.8)
    expect(trueValue(value.i)).to.be.equal(3.5)
  })

  it('Lots of blank characters', async () => {
    const { value, type } = await processInput('           6 - 78 /            i     - 1 =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(value.r).to.be.equal(5)
    expect(value.i).to.be.equal(78)
  })

  it('Shallow operating priorities', async () => {
    const { value, type } = await processInput('2 * (4.5 + i) =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(value.r).to.be.equal(9)
    expect(value.i).to.be.equal(2)
  })

  it('Deep operating priorities', async () => {
    const { value, type } = await processInput('(7i - (6 + 5i * ((2 + (4 * (2i + 0.6i) - 2.25) * 4 + 8)) / (2 * i)) + 2) =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(-6.5)
    expect(value.i).to.be.equal(-97)
  })


  it('Use stored Numerals', async () => {
    await processInput('a = 25.5 + 8i')
    await processInput('b = 2 - 2i')
    await processInput('c = 74 % 7')
    const { value, type } = await processInput('a / b + c =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(8.375)
    expect(trueValue(value.i)).to.be.equal(8.375)
  })

  it('Use stored Expressions', async () => {
    await processInput('f(x) = 2 * x + 9.5')
    await processInput('g(x) = x / i')
    await processInput('h(x) = 2 ^ x')
    const { value, type } = await processInput('f(2) + g(2i) * h(8) =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(525.5)
    expect(value.i).to.be.equal(0)
  })

  it('Use stored Expressions', async () => {
    await processInput('f(x) = 2 * x + 9.5')
    await processInput('g(x) = x / i')
    await processInput('h(x) = 2 ^ x')
    const { value, type } = await processInput('f(2) + g(2i) * h(8) =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Numeral')
    expect(trueValue(value.r)).to.be.equal(525.5)
    expect(value.i).to.be.equal(0)
  })

  it('Use stored Matrices', async () => {
    await processInput('m = [[ 2,0 ]; [2.8 + i, -0.72 ]]')
    await processInput('n = [[ 4i,-1 +5.6i]; [ -6,1 ]]')
    const { value, type } = await processInput('m + n =?')

    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.an.equal('Matrix')
    expect(value.values[0][0].constructor.name).to.be.equal('Numeral')
    expect(value.values[0][1].constructor.name).to.be.equal('Numeral')
    expect(value.values[1][0].constructor.name).to.be.equal('Numeral')
    expect(value.values[1][1].constructor.name).to.be.equal('Numeral')
    expect(value.values[0][0].r).to.be.equal(2)
    expect(value.values[0][0].i).to.be.equal(4)
    expect(value.values[0][1].r).to.be.equal(-1)
    expect(trueValue(value.values[0][1].i)).to.be.equal(5.6)
    expect(trueValue(value.values[1][0].r)).to.be.equal(-3.2)
    expect(value.values[1][0].i).to.be.equal(1)
    expect(trueValue(value.values[1][1].r)).to.be.equal(0.28)
    expect(value.values[1][1].i).to.be.equal(0)
    })
}
