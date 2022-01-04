module.exports = () => {
  describe('Computation', require('./computation/index.js'))
  describe('Built-ins', require('./builtins/index.js'))
  describe('Commands', require('./commands/index.js'))
}