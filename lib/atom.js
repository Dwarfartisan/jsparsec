var operator = require("./operator.js");



var one = function() {
    var result = state.next();
    if (result instanceof Error)
        throw null;
    else {
        return new Result(result);
    }
}
one.prototype = operator;


var equal = function(element1,element2) {
    if (element1 === element2) {
        return element1;
    }else {
        throw new Error();
    }
}
equal.prototype = operator;



var notEqual = function(element1,element2) {
    return !equal(element1,element2);
}
notEqual.prototype = operator;



var oneOf = function(states) {
    for(var item in states){
        if (item === state) {
            return item;
        }
    }
    throw new Error("not match");
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