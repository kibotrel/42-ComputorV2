module.exports = () => {
  describe('Computation', require('./computation/index.js'))
  describe('Assignation', require('./assignation/index.js'))
  describe('Evaluation', require('./evaluation/index.js'))
  describe('Errors', require('./errors/index.js'))
}
