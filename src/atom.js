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
