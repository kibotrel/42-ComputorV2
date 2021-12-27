const { numeralEquality } = require('../../utils/parsing.js')

module.exports = () => {
  it('Simple equation', async () => {
    const { value: { infos } } = await processInput('!solve x^2 = 4')
    const { roots, discriminant, degree } = infos
    const expectedRoots = [{ r: 2, i: 0 }, { r: -2, i: 0 }]
    const expectedDiscriminant = { r: 16, i: 0 }

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(2)
    expect(degree).to.equal(2)
    expect(numeralEquality(discriminant, expectedDiscriminant)).to.equal(true)

    for (let i = 0; i < roots.length; i++) {
      expect(numeralEquality(roots[i], expectedRoots[i])).to.equal(true)
    }
  })

  it('Harder equation', async () => {
    const { value: { infos } } = await processInput('!solve x^2 + 6 -2x ^ 2 + 3x = 3 + x')
    const { roots, discriminant, degree } = infos
    const expectedRoots = [{ r: -1, i: 0 }, { r: 3, i: 0 }]
    const expectedDiscriminant = { r: 16, i: 0 }

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(2)
    expect(degree).to.equal(2)
    expect(numeralEquality(discriminant, expectedDiscriminant)).to.equal(true)

    for (let i = 0; i < roots.length; i++) {
      expect(numeralEquality(roots[i], expectedRoots[i])).to.equal(true)
    }
  })

  it('Simplification to quadratic equation after reduction', async () => {
    const { value: { infos } } = await processInput('!solve x^2 + 4x + 7x^3 = 2x^3 + 5x^3')
    const { roots, discriminant, degree } = infos
    const expectedRoots = [{ r: 0, i: 0 }, { r: -4, i: 0 }]
    const expectedDiscriminant = { r: 16, i: 0 }

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(2)
    expect(degree).to.equal(2)
    expect(numeralEquality(discriminant, expectedDiscriminant)).to.equal(true)

    for (let i = 0; i < roots.length; i++) {
      expect(numeralEquality(roots[i], expectedRoots[i])).to.equal(true)
    }
  })

  it('Positive Disciminant', async () => {
    const { value: { infos } } = await processInput('!solve x^2 = 4')
    const { roots, discriminant, degree } = infos
    const expectedRoots = [{ r: 2, i: 0 }, { r: -2, i: 0 }]
    const expectedDiscriminant = { r: 16, i: 0 }

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(2)
    expect(degree).to.equal(2)
    expect(numeralEquality(discriminant, expectedDiscriminant)).to.equal(true)

    for (let i = 0; i < roots.length; i++) {
      expect(numeralEquality(roots[i], expectedRoots[i])).to.equal(true)
    }
  })

  it('Null Disciminant', async () => {
    const { value: { infos } } = await processInput('!solve x^2 + 2x = -1')
    const { roots, discriminant, degree } = infos
    const expectedRoots = [{ r: -1, i: 0 }]
    const expectedDiscriminant = { r: 0, i: 0 }

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(1)
    expect(degree).to.equal(2)
    expect(numeralEquality(discriminant, expectedDiscriminant)).to.equal(true)

    for (let i = 0; i < roots.length; i++) {
      expect(numeralEquality(roots[i], expectedRoots[i])).to.equal(true)
    }
  })

  it('Negative Disciminant', async () => {
    const { value: { infos } } = await processInput('!solve x^2 + 2x + 10 = 0')
    const { roots, discriminant, degree } = infos
    const expectedRoots = [{ r: -1, i: 3 }, { r: -1, i: -3 }]
    const expectedDiscriminant = { r: -36, i: 0 }

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(2)
    expect(degree).to.equal(2)
    expect(numeralEquality(discriminant, expectedDiscriminant)).to.equal(true)

    for (let i = 0; i < roots.length; i++) {
      expect(numeralEquality(roots[i], expectedRoots[i])).to.equal(true)
    }
  })
}