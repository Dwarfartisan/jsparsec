var jsParsec = require('../../jsparsec');

var op = jsParsec.getOperator;

var states = 'abcde';

var state = new jsParsec.state(states);

var chai = require('chai');

var assert = chai.assert;

describe("state",function (){
    describe("next",function () {
        it("should return item in states'ss position",function (){

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
            console.log(state.pos())
            assert.equal(state.nextBy(function(x){return x==="b"}),'b')
        })
    })
});
