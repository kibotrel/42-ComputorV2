module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('No stored data', async () => {
    const { value } = await processInput('!matrices')

    expect(value).to.be.an('array')
    expect(value.length).to.equal(0)
  })

  it('One Matrix', async () => {
    await processInput('x = [[2]]')
  
    const { value } = await processInput('!matrices')

    expect(value).to.be.an('array')
    expect(value.length).to.equal(1)
  })

  it('Multiple Matrices', async () => {
    await processInput('x = [[32]]')
    await processInput('y = [[i + 23]]')
    await processInput('z = [[4 + 2i]]')

    const { value } = await processInput('!matrices')

    expect(value).to.be.an('array')
    expect(value.length).to.equal(3)
  })
}