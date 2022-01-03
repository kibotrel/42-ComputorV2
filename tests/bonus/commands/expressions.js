module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('No stored data', async () => {
    const { value } = await processInput('!functions')

    expect(value).to.be.an('array')
    expect(value.length).to.equal(0)
  })

  it('One Expression', async () => {
    await processInput('f(x) = 32x')
  
    const { value } = await processInput('!functions')

    expect(value).to.be.an('array')
    expect(value.length).to.equal(1)
  })

  it('Multiple Expressions', async () => {
    await processInput('f(x) = 32x')
    await processInput('g(x) = i + 23 / x')
    await processInput('h(x) = 4x + 2i')

    const { value } = await processInput('!functions')

    expect(value).to.be.an('array')
    expect(value.length).to.equal(3)
  })
}