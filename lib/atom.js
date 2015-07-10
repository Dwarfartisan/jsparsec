var operator = require('./operator.js');
var Result = require('./model.js').Result;
var one = function() {
    return function(state){
            var result = state.next();
            if (result instanceof Error)
                throw "null";
            else {
                return new Result(result);
            }
        }
    }
one.prototype = operator;



var equal = function(wishingData) {
    return function(state){
        if (state.next() === wishingData) {
            return wishingData;
        }else {
            throw "not equal";
        }    
    }
}
equal.prototype = operator;



var notEqual = function(wishingData) {
    return function(state){
        if (state.next() == wishingData) {
            throw "expecting notEqual,but equal";
        }else{
            return wishingData;
        }    
    }
}
notEqual.prototype = operator;



var oneOf = function() {
    var states = arguments;
    return function(state){
        var stateData = state.next();
        for(var item in states){
            if (states[item] === stateData) {
                return item;
            }
        }
        throw "not match";
    }
}
oneOf.prototype = operator;


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
noneOf.prototype = operator;



var pack = function() {
        return function() {
        console.log("Pack run");
    }
}
pack.prototype = operator;




var fail = function() {
    return function(){
        throw "FAIL";
    }
}
fail.prototype = operator;




exports.one = one;
exports.oneOf = oneOf;
exports.equal = equal;
exports.notEqual = notEqual;
exports.noneOf = noneOf;
exports.pack = pack;
exports.Result = Result;