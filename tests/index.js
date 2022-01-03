const path = require('path')
require('module-alias')(path.join(__dirname, '..'))

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const assert = require('assert')

// Config

global.Config = require('./utils/env.json')

// Classes

global.AssertionError = assert.AssertionError
global.ComputorError = require('@classes/error.js')
global.Numeral = require('@classes/numeral.js')
global.Expression = require('@classes/expression.js')
global.Matrix = require('@classes/matrix.js')

// Useful functions

global.processInput = require('@handlers/input.js')
global.numeralValue = require('@srcs/maths/compute.js').numeralValue
global.builtinHandler = require('@handlers/built-in.js')

// Data

global.Variables = []
global.InputHistory = []

// Assertion protocol

chai.use(chaiAsPromised)
global.expect = chai.expect
global.assert = assert

describe('Basic', require('./basic/index.js'))
describe('Advanced', require('./advanced/index.js'))
describe('Bonus', require('./bonus/index.js'))
