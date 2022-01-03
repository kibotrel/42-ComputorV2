module.exports = () => {
  describe('!variables, shows stored Numeral elements', require('./variables.js'))
  describe('!matrices, shows stored Matrix elements', require('./matrices.js'))
  describe('!functions, shows stored Expression elements', require('./expressions.js'))
  describe('!history, shows previous inputs', require('./history.js'))
  describe('!set, modify context configuration', require('./set.js'))
  describe('!reset, set default context', require('./reset.js'))
}