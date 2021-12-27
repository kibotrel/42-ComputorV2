const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  it('Simple equation', async () => {
    const { value: { infos } } = await processInput('!solve x = 5')
    const { roots, discriminant, degree } = infos
    const expectedRoot = { r: 5, i: 0 }

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(1)
    expect(degree).to.equal(1)
    expect(discriminant).to.equal(undefined)
    expect(numeralEquality(roots[0], expectedRoot)).to.equal(true)
  })

  it('Harder equation', async () => {
    const { value: { infos } } = await processInput('!solve 24.5x + 16 - 5 = 0.5x - 11 + 7')
    const { roots, discriminant, degree } = infos
    const expectedRoot = { r: -0.625, i: 0 }

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(1)
    expect(degree).to.equal(1)
    expect(discriminant).to.equal(undefined)
    expect(numeralEquality(roots[0], expectedRoot)).to.equal(true)
  })

  it('Simplification to linear equation after reduction', async () => {
    const { value: { infos, stack } } = await processInput('!solve 3x^2 + 9x - 7 + 7x^2 = 5.5x^2 + 8x + 4.5x^2')
    const { roots, discriminant, degree } = infos
    const expectedRoot = { r: 7, i: 0 }

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(1)
    expect(degree).to.equal(1)
    expect(discriminant).to.equal(undefined)
    expect(numeralEquality(roots[0], expectedRoot)).to.equal(true)
  })
}