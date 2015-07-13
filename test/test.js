var jsParsec = require('../../jsparsec');

var op = jsParsec.getparsec;

var chai = require('chai');

var assert = chai.assert;

var atom = jsParsec.atom;

var combinator = jsParsec.combinator;

var Result = jsParsec.model.Result;

//TODO :先把测试用例全部跑通,然后重新设计一下对外的接口,还有bind,then,over方法需要编写
//所有throw字符串的方法全部改写成
/*
            var err = Error("expecting a value not equal " + x)
            err.pos = state.pos()
            throw err;
这种格式

*/



describe('state',function (){
    var state;
    describe('next',function () {
        it("should return a ",function(){
            state = new jsParsec.state('a');
            assert.equal(state.next(),'a')
        });
    });
    describe('pos',function () {
        it('should return the pos',function() {
            state = new jsParsec.state('aa');
            state.next();
            state.next();
            assert.equal(2,state.pos());
        });
    });
    describe('nextBy',function () {
        it('should return a',function(){
            state = new jsParsec.state('aaa');
            assert.equal(state.nextBy(new Function("x","return x == 'a';")),'a')
        });
    });
    describe('seek_to',function(){
        it('seek_to the 0 position',function(){
            state = new jsParsec.state('abc');
            state.next();
            state.next();
            state.seekTo(0);
            assert.equal(state.pos(),0);
        });
    });
});

describe('parsec',function(){
    describe('atom',function(){
        it('one',function(){
            state = new jsParsec.state('abc');
            var one = atom.one();
            var re = one(state);
            assert.instanceOf(re,Result);
        });
        it('equal',function(){
            state = new jsParsec.state('abc');
            var eq = atom.equal('a');
            var re = eq(state);
            assert.equal(re, 'a');
            assert.throw(function(){
                re = eq(state);
            },Error);
        });
        it('not equal',function(){
            state = new jsParsec.state('abc');
            var ne = atom.notEqual('b');
            var re = ne(state);
            assert.equal(re, 'a');
            assert.throw(function(){
                re = ne(state);
            },Error);
        });
        it('one of',function(){
            state = new jsParsec.state('abc');
            var oneOf = atom.oneOf('q','w','e','r','t','a');
            var re = oneOf(state);
            assert.equal(re, 'a');
            assert.throw(function(){
                oneOf(state);
            }, Error);
        });
        it('none of',function(){
            state = new jsParsec.state('abc');
            var noneOf = atom.noneOf('q','w','e','r','t','b');
            noneOf(state);
            assert.throw(function(){
                noneOf(state);
            },Error);
        });
        it('pack',function(){
            var pack = atom.pack();
            pack();
        });
        it('fail',function(){
            var fail = atom.fail();
            assert.throw(function(){
                fail();
            },Error);
        });
    });
    describe('combinator',function(){
        it('attempt',function(){
            state = new jsParsec.state('a');
            var ne = atom.notEqual('a');
            var attempt = combinator.attempt(ne);
            var prePos = state.pos();
            assert.throw(function(){
                attempt(state);
            }, Error);
            assert.equal(state.pos(), prePos);
        });
        it('either',function(){
            state = new jsParsec.state('aac');
            var eq = atom.equal('b');
            var ne = atom.notEqual('b');
            var either = combinator.either(eq,ne);
            var re = either(state);
            assert.equal('a',re);
        });
        it('either or',function(){
            state = new jsParsec.state('abc');
            var eq = atom.equal('b');
            var ne = atom.notEqual('b');
            var no = atom.noneOf('q','w','e','r','t','b','c');
            var or = combinator.either(eq,ne).or(no);
            assert.throw(function(){
                or(state);
            },Error);

            state = new jsParsec.state('abd');
            assert.equal('d',or(state));
        });
        it('choice',function(){
            state = new jsParsec.state('abc');
            var eq = atom.equal('b');
            var ne = atom.notEqual('b');
            var no = atom.noneOf('q','w','e','r','t','b','c');
            var choice = combinator.choice(eq,ne,no);
            assert.throw(function(){
                choice(state);
            },Error);

            state = new jsParsec.state('abd');
            assert.equal(choice(state),'d');
        });
        it('between',function(){
            state = new jsParsec.state('abd');
            var eq = atom.equal('a');
            var ne = atom.notEqual('a');
            var no = atom.noneOf('q','w','e','r','t','b','c');
            var between = combinator.between(eq,ne,no);
            assert.equal(between(state),'b');
        });
        it('otherwise',function(){
            state = new jsParsec.state('bd');
            var eq = atom.equal('a');
            var ow = combinator.otherwise(eq,'the first operator is fail , so sad');
            try{
                ow(state);
            }catch(err){
                assert.equal('the first operator is fail , so sad',err.message);
            }
        });
        it('many',function(){
            state = new jsParsec.state('aaaaaaaaab');
            var equal = atom.equal('a');
            var many = combinator.many(equal);
            var arr = many(state);
            assert.equal(9,arr.length);
        });
        it('many1',function(){
            state = new jsParsec.state('aaaaaaaaab');
            var eq = atom.equal('a');
            var ma = combinator.many(eq);
            var arr = ma(state);
            assert.equal(9,arr.length);

//TODO : 这里需要重新设计
            state = new jsParsec.state('baaaaab');
            var ma1 = combinator.many1(eq);
            assert.throw(function () {
                ma1(state);
            },Error);
        });
        it('many tail',function(){
            state = new jsParsec.state('aaaaaaaaab');
            var eq = atom.equal('a');
            var ne = atom.notEqual('a');
            var mat = combinator.manyTail(eq,ne);
            mat(state);
            assert.equal(10,state.pos());
        });
        // it('many1 tail',function(){
        //     var equal = atom.equal('b');
        //     var notEqual = atom.notEqual('b');
        //     var many1Tail = combinator.many1Tail(equal,notEqual);
        //     many1Tail(state);
        // });
    //     it('skip',function(){
    //         var equal = atom.equal('b');
    //         var notEqual = atom.notEqual('b');
    //         var skip = combinator.skip(equal);
    //         skip(state);
    //     });
    //     it('skip1',function(){
    //         var equal = atom.equal('b');
    //         var notEqual = atom.notEqual('b');
    //         var skip1 = combinator.skip(equal);
    //         skip1(state);
    //     });
    //     it('sep',function(){
    //         var sepOp = atom.equal('|');
    //         var notEqual = atom.notEqual('b');
    //         var sep = combinator.sep(notEqual,sepOp);
    //         sep(state);
    //     });
    //     it(sep1,function(){
    //         var sepOp = atom.equal('|');
    //         var notEqual = atom.notEqual('b');
    //         var sep1 = combinator.sep(notEqual,sepOp);
    //         sep1(state);
    //     });
    });
});