module.exports = () => {
  it('Simple equation with infinite roots', async () => {
    const { value: { infos } } = await processInput('!solve 1 = 1')
    const { roots, discriminant, degree } = infos

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(1)
    expect(degree).to.equal(0)
    expect(discriminant).to.equal(undefined)
    expect(roots[0]).to.equal(Infinity)
  })

  it('Harder equation with infinite roots', async () => {
    const { value: { infos } } = await processInput('!solve 24 + 16 - 37 = 5.5 + 8 + 0.5 - 11')
    const { roots, discriminant, degree } = infos

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(1)
    expect(degree).to.equal(0)
    expect(discriminant).to.equal(undefined)
    expect(roots[0]).to.equal(Infinity)
  })

  it('Simple equation without roots', async () => {
    const { value: { infos } } = await processInput('!solve 1 = 2')
    const { roots, discriminant, degree } = infos

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(1)
    expect(degree).to.equal(0)
    expect(discriminant).to.equal(undefined)
    expect(roots[0]).to.equal(undefined)
  })

  it('Harder equation without roots', async () => {
    const { value: { infos } } = await processInput('!solve 1 + 7 - 2 = 2 - 2 + 1.2')
    const { roots, discriminant, degree } = infos

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(1)
    expect(degree).to.equal(0)
    expect(discriminant).to.equal(undefined)
    expect(roots[0]).to.equal(undefined)
  })

  it('Simplification to constant equation after reduction', async () => {
    const { value: { infos, stack } } = await processInput('!solve 3x + 4 - 3.1 = 2.5x + 0.5x + 0.9')
    const { roots, discriminant, degree } = infos

    expect(roots).to.be.an('array')
    expect(roots.length).to.equal(1)
    expect(degree).to.equal(0)
    expect(discriminant).to.equal(undefined)
    expect(roots[0]).to.equal(Infinity)
  })
}