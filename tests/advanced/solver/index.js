module.exports = () => {
  describe('Commons', require('./commons.js'))
  describe('Constant equations', require('./constants.js'))
  describe('Linear equations', require('./linears.js'))
  describe('Quadratic equations', require('./quadratics.js'))
}