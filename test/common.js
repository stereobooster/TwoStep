// chai
global.chai = require("chai");

// should style
global.should = require("chai").should();

// expect style
// global.expect = require("chai").expect;

// assert style
// global.assert = require("chai").assert;
 
// sinon
global.sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
 
// force the test environment to "test"
process.env.NODE_ENV = "test";

global.fs = require("fs");

// test coverage
require("blanket");

global.TwoStep = require("../lib/TwoStep");