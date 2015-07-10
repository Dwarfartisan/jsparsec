var jsParsec = require('../../jsparsec');

var op = jsParsec.getOperator;



var chai = require('chai');

var assert = chai.assert;

var atom = jsParsec.atom;

var combinator = jsParsec.combinator;

var Result = jsParsec.model.Result;


describe("state",function (){
    var states = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    var state = new jsParsec.state(states);
    
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
        it("should return a",function(){
            assert.equal(state.nextBy(new Function("x","return x == 'a';")),'a')
        })
    })
    describe("seek_to",function(){
        it("seek_to the 0 position",function(){
            state.seekTo(0);
            assert.equal(state.next(),'a');
        })
    })
});

describe("operator",function(){
    describe("atom",function(){
        it("one",function(){
            var one = atom.one();
            assert.instanceOf(one(state),Result);
        })
        it("equal",function(){
            var equal = atom.equal('a');
            equal(state);
            assert.Throw(equal,Error);
        })
        it("notEqual",function(){
            var notEqual = atom.notEqual('b');
            notEqual(state);
            assert.Throw(notEqual,Error)
        })
        it("oneOf",function(){
            var oneOf = atom.oneOf('q','w','e','r','t','a');
            oneOf(state);
            var oneOf2 = atom.oneOf('q','w','e','r','t','c');
            oneOf2(state);
        })
        it("noneOf",function(){
            var noneOf = atom.noneOf('q','w','e','r','t','c');
            noneOf(state);
            var noneOf2 = atom.noneOf('q','w','e','r','t','c','a');
            noneOf2(state);
        })
        it("pack",function(){
            var pack = atom.pack();
            pack();
        })    
        it("fail",function(){
            var fail = atom.fail();
            fail();
        })      
    })
    describe("combinator",function(){
        it("attempt",function(){
            var attempt = combinator.attempt;
            var notEqual = atom.notEqual('a');
            var prePos = state.pos();
            //这里为什么catch不住?
            attempt(notEqual(state));
            assert.notEqual(state.pos(),prePos);
        })
        it("either",function(){
            var equal = atom.equal('b');
            var notEqual = atom.notEqual('b');
            var either = combinator.either();
            //这里也catch不住
            var either = combinator.either(equal,notEqual);
            either(state);
            var or = either(equal,notEqual).or(noneOf);
            or(state);
        })
        it("choice",function(){
            var equal = atom.equal('b');
            var notEqual = atom.notEqual('b');
            var choice = combinator.choice(equal,notEqual);
            //这里也catch不住
            choice(state);
        })
        it("between",function(){
            var equal = atom.equal('b');
            var notEqual = atom.notEqual('b');
            var noneOf = atom.noneOf('q','w','e','r','t','c');
            var between = combinator.between(equal,notEqual,noneOf);
            between(state);
        })
        it("otherwise",function(){
            var equal = atom.equal('b');
            var notEqual = atom.notEqual('b');
            var otherwise = combinator.otherwise();
            otherwise(equal(state),notEqual(state));
        })
        it("many",function(){
            var equal = atom.equal('a');
            var many = combinator.many(equal);
            many(state);
        })
        it("many1",function(){
            var equal = atom.equal('a');
            var many1 = combinator.many1(equal);
            many1(state);
        })
        it("manyTail",function(){
            var equal = atom.equal('b');
            var notEqual = atom.notEqual('b');
            var manyTail = combinator.manyTail(equal,notEqual);
            manyTail(state);
        })    
        it("many1Tail",function(){
            var equal = atom.equal('b');
            var notEqual = atom.notEqual('b');
            var many1Tail = combinator.many1Tail(equal,notEqual);
            many1Tail(state);
        }) 
        it("skip",function(){
            var equal = atom.equal('b');
            var notEqual = atom.notEqual('b');
            var skip = combinator.skip(equal);
            skip(state);
        })
        it("skip1",function(){
            var equal = atom.equal('b');
            var notEqual = atom.notEqual('b');
            var skip1 = combinator.skip(equal);
            skip1(state);
        })
        it("sep",function(){
            var sepOp = atom.equal('|');
            var notEqual = atom.notEqual('b');
            var sep = combinator.sep(notEqual,sepOp);
            sep(state);
        })
        it("sep1",function(){
            var sepOp = atom.equal('|');
            var notEqual = atom.notEqual('b');
            var sep1 = combinator.sep(notEqual,sepOp);
            sep1(state);
        })
    })
})
