module.exports = () => {
  beforeEach(() => {
    InputHistory.splice(0, InputHistory.length)
  })

  it('No history', async () => {
    const { value } = await processInput('!history')

    expect(value).to.be.an('array')
    expect(value.length).to.equal(1)
  })

  it('Few inputs registered', async () => {
    await processInput('!variables')
    await processInput('x = 3')
    await processInput('x + 9 =?')

    const { value } = await processInput('!history')

    expect(value).to.be.an('array')
    expect(value.length).to.equal(4)
  })
}