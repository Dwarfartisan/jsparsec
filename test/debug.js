var jsParsec = require('../../jsparsec');

var op = jsParsec.getparsec;

var chai = require('chai');

var assert = chai.assert;

var atom = jsParsec.atom;

var combinator = jsParsec.combinator;

var Result = jsParsec.model.Result;

var text = jsParsec.text;



state = new jsParsec.state('123.1asd');
var uFloat = text.uFloat();
assert.equal('123.1',uFloat(state));