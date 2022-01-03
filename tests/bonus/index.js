module.exports = () => {
  describe('Computation', require('./computation/index.js'))
  describe('Assignation', require('./assignation/index.js'))
  describe('Built-ins', require('./builtins/index.js'))
  describe('Commands', require('./commands/index.js'))
  // describe('Errors', require('./computation/index.js'))
}