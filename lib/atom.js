var parsec = require('./parsec.js');
var Result = require('./model.js').Result;
var one = function() {
    return function(state){
            var result = state.next();
            if (result instanceof Error)
                throw null;
            else {
                return new Result(result);
            }
        }
    }
one.prototype = parsec;



var equal = function(x) {
    return function(state){
        if (state.next() === x) {
            return x;
        }else {
            throw "not equal";
        }
    }
}
equal.prototype = parsec;



var notEqual = function(x) {
    return function(state){
        var data = state.next()
        if (data === x) {
            throw "expecting not equal";
        }else{
            return data
        }
    }
}
notEqual.prototype = parsec;

var oneOf = function() {
    var states = arguments;
    return function(state){
        var data = state.next();
        for(var item in states){
            if (states[item] === data) {
                return data;
            }
        }
        var err = Error("expect one of" + states)
        err.pos = state.pos()
        throw err;
    }
}
oneOf.prototype = parsec;


var noneOf = function() {
    var states = arguments;
    return function(state){
        var stateData = state.next();
        for(var item in states){
            if (states[item] === stateData) {
                throw "expecting not match ,but match";
            }
        }
        return stateData;
    }
}
noneOf.prototype = parsec;



var pack = function() {
        return function() {
        console.log("Pack run");
    }
}
pack.prototype = parsec;

var fail = function() {
    return function(){
        throw "FAIL";
    }
}
fail.prototype = parsec;




exports.one = one;
exports.oneOf = oneOf;
exports.equal = equal;
exports.notEqual = notEqual;
exports.noneOf = noneOf;
exports.pack = pack;
exports.Result = Result;
