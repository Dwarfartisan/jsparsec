var jsParsec = require('../../jsparsec');

var op = jsParsec.getOperator;

var states = 'abcde';

var state = new jsParsec.state(states);

var chai = require('chai');

var assert = chai.assert;

describe("state",function (){
    describe("next",function () {
        it("should return a ",function(){
            assert.equal(state.next(),'a')
        })
    })
    describe("pos",function () {
        it("should return the pos",function() {
            assert.equal(state.pos(),1);
        })
    })
    describe("nextBy",function () {
        it("should return b",function(){
            assert.equal(state.nextBy(new Function("x","return x == 'b';")),'b')
        })
    })
    describe("seek_to",function(){
        it("seek_to the 0 position",function(){
            state.seekTo(0);
            assert.equal(state.next(),'a');
        })
    })
});