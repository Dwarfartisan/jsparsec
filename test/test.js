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
            assert.equal(state.nextBy(function(x){
                return x == 'b';
            }),'b')
        })
    })
    describe("seek_to",function(){
        it("seek_to the 0 position",function(){
            state.seekTo(0);
            assert.equal(state.next(),'a');
        })
    })
});
/*

var date =  "2015-01-01";
var state = getState(time);
var expression = many(oneOf('0','1','2','3','4','5','6','7','8','9')).bind(many(equal('-').bind(many(oneOf('0','1','2','3','4','5','6','7','8','9'),2))))
//算子都应该有一个构造方法 用来接收state

expression(state);



*/