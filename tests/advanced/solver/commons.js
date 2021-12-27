const { numeralEquality , arrayEquality } = require('../../utils/parsing.js')

module.exports = () => {
  it('Lots of blank characters', async () => {
    const { value: { infos } } = await processInput('!solve              x     =     2  ')
    const { roots, discriminant, degree } = infos
    const expectedRoot = { r: 2, i: 0 }

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(1)
    expect(degree).to.equal(1)
    expect(discriminant).to.equal(undefined)
    expect(numeralEquality(roots[0], expectedRoot)).to.equal(true)
  })

  it('Reduce equation', async () => {
    const { value: { stack } } = await processInput('!solve 2x + 4x - 2 = 23.1')
    const expectedResult = [
      { sign: 1, factor: 6, power: 1 },
      { sign: -1, factor: 25.1, power: 0 }
    ]

    expect(arrayEquality(stack, expectedResult)).to.equal(true)
  })

  it('Sort powers from highest to lowest', async () => {
    const { value: { stack } } = await processInput('!solve 2x + 4x^2 - 2 = 23.1')

    let lastPower = Infinity

    for (const polynom of stack) {
      expect(polynom.power).to.be.below(lastPower)
      lastPower = polynom.power
    }
  })

  it('Reduce equation', async () => {
    const { value: { stack } } = await processInput('!solve 2x + 4x - 2 = 23.1')
    const expectedResult = [
      { sign: 1, factor: 6, power: 1 },
      { sign: -1, factor: 25.1, power: 0 }
    ]

    expect(arrayEquality(stack, expectedResult)).to.equal(true)
  })

  it('Compute at least degree of cubic equations and above', async () => {
    const { value: { infos } } = await processInput('!solve 2x^12 + x - 4 = 6.2x^2')
    const { degree, roots, discriminant } = infos

    expect(degree).to.equal(12)
    expect(roots).to.equal(undefined)
    expect(discriminant).to.equal(undefined)
  })
}