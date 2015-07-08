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
            assert.equal(state.nextBy(new Function("return false;")),'b')
        })
    })
});











// console.log(state.next());
// console.log(state.pos());


// console.log(state.next());
// console.log(state.pos())

// console.log(state.next());
// console.log(state.pos())

// var pred = function(item){
//     return item == 'D';
// };
// console.log(state.nextBy(pred));