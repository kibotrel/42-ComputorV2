const { matrixEquality } = require('../../utils/parsing.js')

module.exports = () => {
  afterEach(() => {
    Variables.splice(0, Variables.length)
  })

  it('Use stored Matrices', async () => {
    await processInput('m = [[ 2,0 ]; [2.8 + i, -0.72 ]]')
    await processInput('n = [[ 4i,-1 +5.6i]; [ -6,1 ]]')

    const { value, type } = await processInput('m + n =?')
    const expectedResult = [
      [{ r: 2, i: 4 }, { r: -1, i: 5.6 }],
      [{ r: -3.2, i: 1}, { r: 0.28, i: 0 }]
    ]
  
    expect(value).to.be.an('object')
    expect(type).to.be.a('string').that.equals('computation')
    expect(value.constructor.name).to.equal('Matrix')
    expect(value.values).to.be.an.an('array')

    for (const row of value.values) {
      expect(row).to.be.an('array')
      for (const term of row) {
        expect(term.constructor.name).to.equal('Numeral')
      }
    }

    expect(matrixEquality(value.values, expectedResult)).to.equal(true)
  })
}
