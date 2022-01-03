module.exports = () => {
  it('Update allowed setting', async () => {
    const { value } = await processInput('!set number.fractionForm true')

    expect(value).to.be.an('object')
    expect(value).to.have.ownProperty('section')
    expect(value).to.have.ownProperty('property')
    expect(value).to.have.ownProperty('value')
    expect(value.section).to.equal('number')
    expect(value.property).to.equal('fractionForm')
    expect(value.value).to.equal(true)
  })
}