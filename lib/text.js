var atom = require('./atom.js');
var combinator = require('./combinator.js');
var atom = require('./atom.js')
var parsec = require('./parsec.js');

var digit = function() {
    var fun = atom.charOf('0123456789');
    return fun;
};

var letter = function(){
    var fun = atom.charOf('abcdefghijklmnopqrstuvwxyz');
    return fun;
};

var alphaNumber = function(){
    var fun = combinator.either(digit,letter);
    return fun;
};

var string = function(str){
    var fun = function(state){
        var arr = new Array();
        for(var c in str){
            var val = state.next();
            arr.push(val);
            if (val != c) {
                var err = Error('not match');
                err.pos = state.pos() - 1 ;
                throw err;
            };
        }
        return arr.toString(); 
    };
    parsec(fun);
    return fun;
};


var uInt = function(){
    var fun = function(state){
        var ma = combinator.many1(atom.digit).then();
        return ma(state);
    };
    parsec(fun);
    return fun;
};

var Int = function(){
    var fun = function(state){
        var eq = atom.equal('-');
        var op = eq.then(uInt);
        return op(state);
    };
    parsec(fun);
    return fun;
};

var uFloat = function(){
    var fun = function (state) {
        var eq = atom.equal('.');
        var ma = combinator.many1(atom.digit);
        var op = ma.then(eq).then(ma);
        return op(state); 
    };
    parsec(fun);
    return fun;
};

var Float = function(){
    var fun = function(state){
        //TODO :这里应该有没有'-'  都可以
        var eq = atom.equal('-');
        var op = eq.then(uFloat);
        return op(state);
    };
    parsec(fun);
    return fun;
};


var newLine = function(){
    var fun = function(){
        
    }
}