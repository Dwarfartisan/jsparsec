(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.parsec = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var parsec = require('./parsec.js');
var Result = require('./model.js').Result;
var one = function() {
    var fun = function(state){
        var result = state.next();
        if (result instanceof Error)
            throw null;
        else {
            return new Result(result);
        }
    };
    parsec(fun);
    return fun;
};


var eq = function(x) {
    var fun = function(state){
        if (state.next() === x) {
            return x;
        }else {
            var err = Error("expecting a value equal" + x);
            err.pos = state.pos() - 1;
            throw err;
        }
    }
    parsec(fun);
    return fun;
};



var ne = function(x) {
    var fun = function(state){
        var data = state.next()
        if (data === x) {
            var err = Error('expecting a value not equal' + x);
            err.pos = state.pos() - 1;
            throw err;
        }else{
            return data
        }
    };
    parsec(fun);
    return fun;
};

var oneOf = function() {
    var states = arguments;
    var fun = function(state){
        var data = state.next();
        for(var index in states){
            if (states[index] === data) {
                return data;
            }
        }
        var err = Error('expect one of' + states);
        err.pos = state.pos();
        throw err;
    };
    parsec(fun);
    return fun;
};



var noneOf = function() {
    var states = arguments;
    var fun = function(state){
        var data = state.next();
        for(var index in states){
            if (states[index] === data) {
                var err = Error('expect none of ' + states);
                err.pos = state.pos;
                throw err;
            }
        }
        return data;
    };
    parsec(fun);
    return fun;
};

var pack = function(element) {
    var fun = function() {
        return element;
    };
    parsec(fun);
    return fun;
};

var fail = function(description) {
    var fun = function(state){
        var err = Error(description);
        err.pos = state.pos() - 1;
        throw err;
    }
    parsec(fun);
    return fun;
};






// space : \t  || '  ' || \n

// \r \ n


// 上面应该直接返回字符串

exports.one = one;
exports.oneOf = oneOf;
exports.eq = eq;
exports.ne = ne;
exports.noneOf = noneOf;
exports.pack = pack;
exports.Result = Result;
exports.fail = fail;

},{"./model.js":4,"./parsec.js":5}],2:[function(require,module,exports){
var parsec = require('./parsec.js');
var atom = require('./atom.js');

var attempt = function(p) {
    var fun = function(state){
        var result;
        var index = state.pos();
        var tran = state.begin();
        try{
            result = p(state);
        } catch (err){
            state.rollBack(tran);
            throw err;
        }
        state.commit(tran);
        return result;
    };
    parsec(fun);
    return fun;
}


var between = function(parseren, close, p) {
    var fun = function(state){
        parseren(state);
        var result = p(state);
        close(state);
        return result;
    };
    parsec(fun);
    return fun;
}

//either.or();
var either = function(p1,p2) {
    var fun = function (state) {
        // this.or = xxxxx 这样写外面就拿不到 or 这个属性?
        var result1;
        try{
            result1 = p1(state);
        }catch(err){
            var result2 = p2(state);
            return result2;
        }
        return result1;
    };
    fun.or = function(p3){
        return either(either(p1,p2),p3);
    };
    parsec(fun);
    return fun;
}


var otherwise = function(p,description) {
    var fun = function(state){
        var ei = either(p,atom.fail(description));
        return ei(state);
    };
    parsec(fun);
    return fun;
}


var choice = function (){
    var parsers = arguments;
    var fun = function(state){
        var result = null;
        for(var index in parsers){
            try{
                result = parsers[index](state);
                break;
            }catch(err){
                continue;
            }
        }
        if (result == null) {
            var err = Error('');
            err.pos = state.pos();
            throw err;
        }
        return result;
    };
    parsec(fun);
    return fun;
};


var many = function(p) {
    var fun = function(state){
        var ma = either(many1(attempt(p)),atom.pack(Array(0)));
        var re = ma(state);
        return re;
    };
    parsec(fun);
    return fun;
};


var many1 = function(p) {
    //这里P执行出错了 就直接抛出去
    var fun = p.bind(function(x,state){
        var arr = new Array();
        arr.push(x);
        while(true)
        {
            var at = attempt(p);
            try{
                var val = at(state);
                arr.push(val);
            }catch(err){
                return arr;
            }
        }
        return arr;
    });
    parsec(fun);
    return fun;
};



var manyTill = function(parser,end) {
    var fun = function(state){
        var re = new Array();
        var e = attempt(end);
        while (true) {
            try{
                e(state)
                return re
            } catch (err){
                re.push(parser(state))
            };
        }
    };
    parsec(fun);
    return fun;
};

var skip1 = function(p) {
    var fun = p.bind(function(x,state){
        var arr = new Array();
        while(true)
        {
            try{
                var val = p(state);
            }catch(err){
                return;
            }
        }
    });
    parsec(fun);
    return fun;
};


var skip = function(p) {
    var fun = function(state){
        var sk = either(skip1(attempt(p)),atom.pack(Array(0)));
        var re = sk(state);
        return re;
    };
    parsec(fun);
    return fun;
};


var sep = function(p, s) {
    var fun = function(state){
        var parser = either(sep1(p, s), atom.pack(new Array(0)));
        var re = parser(state);
        return re;
    };
    parsec(fun);
    return fun;
};


var sep1 = function(p, s) {
    var fun = function(state){
        var parser = p.bind(function(x,state){
            var temp = new Array();
            temp.push(x);
            var re = temp.concat(many(s.then(p))(state));
            return re;
        });
        var result = parser(state);
        return result;
    };
    parsec(fun);
    return fun;
};

exports.attempt = attempt;
exports.otherwise  = otherwise;
exports.choice = choice;
exports.either = either;
exports.between = between;
exports.many = many;
exports.many1 = many1;
exports.manyTill = manyTill;
exports.skip = skip;
exports.skip1 = skip1;
exports.sep = sep;
exports.sep1 = sep1;

},{"./atom.js":1,"./parsec.js":5}],3:[function(require,module,exports){
var atom = require('./atom');

var combinator = require('./combinator');

var state = require('./state.js');

var parsec = require('./parsec.js');

var model = require('./model.js');

var text = require('./text.js');

exports.atom = atom;

exports.combinator = combinator;

exports.state = state;

exports.getparsec = parsec;

exports.model = model;

exports.text = text;
},{"./atom":1,"./combinator":2,"./model.js":4,"./parsec.js":5,"./state.js":6,"./text.js":7}],4:[function(require,module,exports){
exports.Result = function (result) {
    
}
},{}],5:[function(require,module,exports){
var parsec = function(parser){
    if (parser == null) {
        parser = new Object();
    };
    parser.bind = function(handle){
        var item = function(state){
            var val = parser(state);
            var re =  handle(val,state);
            return re;
        }
        parsec(item);
        return item;
    };
    parser.then = function(handle){
        var item = function(state){
            parser(state);
            return handle(state);
        };
        parsec(item);
        return item;
    };
    parser.over = function(tail){
        var item = function(state){
            var val = parser(state);
            tail(state);
            return val;
        };
        parsec(item);
        return item;
    };
    return parser;
};

module.exports = parsec;
},{}],6:[function(require,module,exports){
module.exports = function(states){
    if(states == null){
        return null;
    }
    var position = 0;
    var tran = -1;
    // this.states = states;
    // this.position = 0;
    this.next =  function() {
        var item;
        if (position >= 0 && position < states.length) {
            item = states[position];
            position++;
        }else {
            item = null;
        }
        return item;
    };
    this.pos = function() {
        return position;
    };
    this.nextBy = function(pred) {
        if (position >= 0 && position < states.length) {
            var item = states[position];
            if (pred(item)) {
                return item;
            } else{
                throw new Error("predicate failed");
            }
        } else {
            return -1;
        }
    };
    this.seekTo = function(to) {
        if (to >= 0 && to < states.length) {
            position = to;
            return true;
        } else {
            return false;
        }
    };

    this.begin = function() {
     var theindex = position
     if (tran == -1){
                tran =position
            }
            return theindex;
        };

    this.commit = function(tranNumber) {
        if (tran == tranNumber) {
            tran = -1
        }
    };
    this.rollBack = function(tranNumber){
        position = tranNumber
        if (tran == tranNumber) {
            tran =-1
        }
    };

}

},{}],7:[function(require,module,exports){
var atom = require('./atom.js');
var combinator = require('./combinator.js');
var atom = require('./atom.js')
var parsec = require('./parsec.js');

var eq = atom.eq;
var either = combinator.either;
var attempt = combinator.attempt;
var ne = atom.ne;

var charIn = function(string){
    var fun = function(state){
        var val = state.next();
        for(var index in string){
            if(string[index] === val){
                return val;
            }
        };
        var err = Error('not a char of ' + string);
        err.pos = state.pos() - 1;
        throw err;
    };
    parsec(fun);
    return fun;
};

var charNone = function(string){
    var fun = function(state){
        var val = state.next();
        for(var c in string){
            if(c === val){
                var err = Error('is a char of ' + string);
                err.pos = state.pos();
                throw err;
            }
        }
        return val;
    }
    parsec(fun);
};

var digit = function() {
    var fun = charIn('0123456789');
    return fun;
};

var letter = function(){
    var fun = charIn('abcdefghijklmnopqrstuvwxyz');
    return fun;
};

var alphaNumber = function(){
    var fun = either(attempt(digit()),letter());
    return fun;
};

var string = function(str){
    var fun = function(state){
        var arr = new Array();
        for(var index in str){
            var val = state.next();
            arr.push(val);
            if (val != str[index] && index == 0) {
                var fail = atom.fail('not match')
                fail(state);
            };
        }
        return arr.join('');
    };
    parsec(fun);
    return fun;
};


var uInt = function(){
    var fun = function(state){
        var ma = combinator.many1(digit()).bind(function(arr,state){
            var at = combinator.attempt(atom.ne('.'));
            at(state);
            return arr;
        });
        var re;
        try{
            re = ma(state)
        }catch(err){
            var err = Error('not a uInt');
            err.pos = state.pos() - 1;
            throw err;
        }
        return re.join('');
    };
    parsec(fun);
    return fun;
};


function negtive(state) {
    var neg = combinator.attempt(eq('-'));
    var val;
    try{
        val = neg(state);
    }catch(err){
        return '';
    }
    return val;
}



var Int = function(){
    var fun = function(state){
        var arr = new Array();
        arr.push(negtive(state));
        var ui = uInt();
        var re = arr.concat(ui(state));
        return re.join('');
    };
    parsec(fun);
    return fun;
};


var uFloat = function(){
    var fun = function (state) {
        var integer = combinator.many(digit());
        var pot = eq('.');
        var deci = uInt();
        var arr = new Array();
        arr = arr.concat(integer(state));
        if(arr.length == 0)
            arr.push('0');
        arr.push(pot(state));
        arr = arr.concat(deci(state));
        return arr.join('');
    };
    parsec(fun);
    return fun;
};


var Float = function(){
    var fun = function(state){
        var arr = new Array();
        arr.push(negtive(state));
        var uf = uFloat();
        var re = arr.concat(uf(state));
        return re.join('');
    };
    parsec(fun);
    return fun;
};


var newLine = function(){
    var fun = function(state){
        var ei =either(attempt(eq('\n')),string('\r\n'));
        return ei(state);
    }
    parsec(fun);
    return fun;
};

var whiteSpace = function(){
    var eq = charIn(' \t');
    return eq;
};

var space = function(){
    var ei = eq(' ');
    return ei;
};


exports.charIn = charIn;
exports.charNone = charNone;
exports.digit = digit;
exports.letter = letter;
exports.alphaNumber = alphaNumber;
exports.string = string;
exports.uInt = uInt;
exports.Int = Int;
exports.uFloat = uFloat;
exports.Float = Float;
exports.newLine = newLine;
exports.whiteSpace = whiteSpace;
exports.space = space;

},{"./atom.js":1,"./combinator.js":2,"./parsec.js":5}]},{},[3])(3)
});