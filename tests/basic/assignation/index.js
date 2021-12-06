module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Numerals', async () => {
    const { value, type } = await processInput('x = 53 + 5.2i')

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Numeral')
    expect(type).to.be.a('string').that.equals('numeral')
    expect(Variables.find(variable => variable.id === 'x')).to.not.equal(undefined)
  })

  it('Expressions', async () => {
    const { value, type } = await processInput('f(x) = x + 5')

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Expression')
    expect(type).to.be.a('string').that.equals('expression')
    expect(Variables.find(variable => variable.id === 'f')).to.not.equal(undefined)
  })

  it('Matrices', async () => {
    const { value, type } = await processInput('m = [[ 9 + 2i, 8.1 ]; [ 7.91, 0.02i ]]')

    expect(value).to.be.an('object')
    expect(value.constructor.name).to.equal('Matrix')
    expect(type).to.be.a('string').that.equals('matrix')
    expect(Variables.find(variable => variable.id === 'm')).to.not.equal(undefined)
  })
}
