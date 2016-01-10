var jsParsec = require('../../jsparsec');

var op = jsParsec.getparsec;

var chai = require('chai');

var assert = chai.assert;

var atom = jsParsec.atom;

var combinator = jsParsec.combinator;

var Result = jsParsec.model.Result;

var text = jsParsec.text;

//TODO :先把测试用例全部跑通,然后重新设计一下对外的接口

//many这种算子,似乎在state走到尽头的情况还没有考虑
//异常不能直接抛 ,每个算子都应该定义自己的异常信息



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
            var eq = atom.eq('a');
            var re = eq(state);
            assert.equal(re, 'a');
            assert.throw(function(){
                re = eq(state);
            },Error);
        });
        it('not equal',function(){
            state = new jsParsec.state('abc');
            var ne = atom.ne('b');
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
            var ne = atom.ne('a');
            var attempt = combinator.attempt(ne);
            var prePos = state.pos();
            assert.throw(function(){
                attempt(state);
            }, Error);
            assert.equal(state.pos(), prePos);
        });
        it('either',function(){
            state = new jsParsec.state('aac');
            var eq = atom.eq('b');
            var ne = atom.ne('b');
            var either = combinator.either(eq,ne);
            var re = either(state);
            assert.equal('a',re);
        });
        it('either or',function(){
            state = new jsParsec.state('abc');
            var eq = atom.eq('b');
            var ne = atom.ne('b');
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
            var eq = atom.eq('b');
            var ne = atom.ne('b');
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
            var eq = atom.eq('a');
            var ne = atom.ne('a');
            var no = atom.noneOf('q','w','e','r','t','b','c');
            var between = combinator.between(eq, no, ne);
            assert.equal(between(state),'b');
        });
        it('otherwise',function(){
            state = new jsParsec.state('bd');
            var eq = atom.eq('a');
            var ow = combinator.otherwise(eq,'the first operator is fail , so sad');
            try{
                ow(state);
            }catch(err){
                assert.equal('the first operator is fail , so sad',err.message);
            }
        });
        it('many till',function(){
            state = new jsParsec.state('aaaaaaaaab');
            var a = atom.eq('a');
            var na = atom.ne('a');
            var mat = combinator.manyTill(a,na);
            mat(state);
            assert.equal(10,state.pos());
        });
        it('many',function(){
            state = new jsParsec.state('aaaaaaaaab');
            var equal = atom.eq('a');
            var many = combinator.many(equal);
            var arr = many(state);
            assert.equal(9,arr.length);
        });
        it('many1',function(){
            state = new jsParsec.state('aaaaaaaaab');
            var eq = atom.eq('a');
            var ma = combinator.many(eq);
            var arr = ma(state);
            assert.equal(9,arr.length);

            state = new jsParsec.state('baaaaab');
            var ma1 = combinator.many1(eq);
            assert.throw(function () {
                ma1(state);
            },Error);
        });
        it('skip',function(){
            state = new jsParsec.state('aaaaaaaaab');
            var equal = atom.eq('a');
            var sk = combinator.skip(equal);
            sk(state);
            assert.equal(9,state.pos());
        });
        it('skip1',function(){
            state = new jsParsec.state('aaaaaaaaab');
            var eq = atom.eq('a');
            var ma = combinator.many(eq);
            var arr = ma(state);
            assert.equal(9,state.pos());

            state = new jsParsec.state('baaaaab');
            var ma1 = combinator.many1(eq);
            assert.throw(function () {
                ma1(state);
            },Error);
        });
        it('sep',function(){
            state = new jsParsec.state('a|a|a|a');
            var s = atom.eq('|');
            var eq = atom.eq('a');
            var sep = combinator.sep(eq, s);
            var re = sep(state);
            assert.equal(4,re.length);
        });
        it('sep1',function(){
            state = new jsParsec.state('a|a|a|a');
            var s = atom.eq('|');
            var eq = atom.eq('a');
            var sep1 = combinator.sep1(eq, s);
            var re = sep1(state);
            assert.equal(4,re.length);

            state = new jsParsec.state('b|a|a|a')
            var sep1 = combinator.sep1(s,eq);
            assert.throw(function(){
                sep1(state);
            },Error);
        });
    });
    describe('text',function(){
        it('digit',function(){
            var digit = text.digit();
            state = new jsParsec.state('a1');
            assert.throw(function(){
                digit(state);
            },Error);
            digit(state);
        });
        it('letter',function(){
            var letter = text.letter();
            state = new jsParsec.state('a1');
            assert.equal('a',letter(state));
            assert.throw(function(){
                letter(state);
            },Error);
        });
        it('alphaNumber',function(){
            var al = text.alphaNumber();
            state = new jsParsec.state('1a%');
            assert.equal('1',al(state));
            assert.equal('a',al(state));
            assert.throw(function(){
                al(state);
            },Error);
        });
        it('string',function(){
            var str = text.string('love');
            state = new jsParsec.state('love you');
            var re = str(state);
            assert.equal('love',re);


            assert.throw(function(){
                str(state);
            },Error);
        });
        it('white space',function(){
            state = new jsParsec.state(' \t');
            var ws = text.whiteSpace();
            assert.equal(' ',ws(state));
            assert.equal('\t',ws(state));

            state = new jsParsec.state('i love you');
            assert.throw(function(){
                ws(state);
            },Error);
        });
        it('new line',function(){
            state = new jsParsec.state('\n');
            var nl = text.newLine();
            assert.equal('\n',nl(state));
            // /r/n 算两个字符
            state = new jsParsec.state('\r\n');
            assert.equal('\r\n',nl(state));

            state = new jsParsec.state('i love you');
            assert.throw(function(){
                nl(state);
            },Error);
        });
        it('space',function(){
            state = new jsParsec.state('\n \r\ni love you');
            var sp = text.space();
            assert.throw(function(){
                sp(state);
            },Error);
            assert.equal(' ',sp(state));
            assert.throw(function(){
                sp(state);
            },Error);
        });
        it('uInt',function(){
            state = new jsParsec.state('12');
            var uInt = text.uInt();
            assert.equal('12',uInt(state));


            state = new jsParsec.state('i love you');
            assert.throw(function(){
                uInt(state);
            });


            state = new jsParsec.state('12.3');
            assert.throw(function(){
                uInt(state);
            },Error);
        });
        it('int',function(){
            state = new jsParsec.state('-123');
            var Int = text.Int();
            assert.equal('-123',Int(state));

            state = new jsParsec.state('123');
            assert.equal('123',Int(state));
        });
        it('uFloat',function(){
            state = new jsParsec.state('123.5asd');
            var uFloat = text.uFloat();
            assert.equal('123.5',uFloat(state));


            state = new jsParsec.state('.5664');
            assert.equal('0.5664',uFloat(state));

            state = new jsParsec.state('45661');
            assert.throw(function(){
                uFloat(state);
            },Error);
        });
        it('float',function(){
            state = new jsParsec.state('123.5asd');
            var Float = text.Float();
            assert.equal('123.5',Float(state));


            state = new jsParsec.state('.5664');
            assert.equal('0.5664',Float(state));

            state = new jsParsec.state('45661');
            assert.throw(function(){
                Float(state);
            },Error);



            state = new jsParsec.state('-123.5asd');
            var Float = text.Float();
            assert.equal('-123.5',Float(state));


            state = new jsParsec.state('-.5664');
            assert.equal('-0.5664',Float(state));

            state = new jsParsec.state('-45661');
            assert.throw(function(){
                Float(state);
            },Error);
        });
    });
});
