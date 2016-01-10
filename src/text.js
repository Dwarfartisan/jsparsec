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
