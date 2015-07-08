var operator = require("./operator.js");

var one = function() {
    console.log(arr[0]);
}
one.prototype = operator;

var equal = function(operator1,operator2) {
    return operator1 === operator2;
}


equal.prototype = operator;
var notEqual = function(operator1,operator2) {
    return !(operator1(state) === operator2(state));
}

notEqual.prototype = operator;
var oneOf = function(states) {
    var flag = false;
    for(var item in states){
        if (item === state) {
            flag = true;
            break;
        };
    }
    return flag;
}

oneOf.prototype = operator;

var noneOf = function(states) {
    return !exports.oneOf(state,states);
}

noneOf.prototype = operator;

var pack = function() {
    console.log("Pack run");
}

pack.prototype = operator;

var fail = function() {
    throw "FAIL"
}
fail.prototype = operator;

exports.one = one;
exports.oneOf = oneOf;
exports.equal = equal;
exports.notEqual = notEqual;
exports.noneOf = noneOf;
exports.pack = pack;