var parsec = require("./parsec.js");

var attempt = function(p) {
    return function(state){
        var result;
        var index = state.pos();
        try{
            result = p(state);
        } catch (err){
            state.seekTo(index);
            throw err
        }
        return result;
    }
}
attempt.prototype = parsec;



var either = function(op1,op2) {
    var or = function (op3) {
        return either(either(op1,op2),op3);
    }
    return function (state) {
        try{
            var resultOp1 = op1(state);
        }catch(err){
            return op2(state);
        }
        return resultOp1;
    }
}
either.prototype = parsec;


var choice = function (){
    var ops = arguments;
    return function(state){
        var result;
        for(var item in ops){
            try{
                result = ops[item](state);
                break;
            }catch(err){
                continue;
            }
            return result;
        }
    }
}
choice.prototype = parsec;



var many = function(op) {
    return function(state){
        var arr = new Array();
        while(true){
            var result = attempt(op)(state);
            if (result instanceof Error) {
                return arr;
            };
            arr.push(result);
        }
    }
}
many.prototype = parsec;

var many1 = function(op) {
    return function(state){
        var result = op(state);
        var arr = new Array();
        arr.push(result);
        arr.contact(many(op)(state));
    }
}
many1.prototype = parsec;


var between = function(op1,op2,op3) {
    return function(state){
        op1(state);
        var result = op2(state);
        op3(state);
        return result;
    }
}
between.prototype = parsec;

var otherwise = function() {
    var ops = arguments;
    return function(state){
        var result;
        for(var item in ops){
            try{
                result = ops[item](state);
                break;
            }catch(err){
                if (item == 0) {
                    return new Error("first op failed");
                };
                continue;
            }
            return result;
        }
    }
}
otherwise.prototype = parsec;

var manyTail = function(op,tailOp) {
    return function(state){
        many(op).over(tailOp)(state);
    }
}
manyTail.prototype = parsec;

var many1Tail = function() {
    return function(state){
        many1(op).over(tailOp)(state);
    }
}
many1Tail.prototype = parsec;

var skip = function(op) {
    return function(state){
        while(true){
            try{
                var result = op(state);
            }catch(err){
                return arr;
            }
        }
    }
}
skip.prototype = parsec;


var skip1 = function(op) {
    return function(state){
        while(true){
            try{
                op(state);
            }catch(err){
                if (arr.length == 0)
                    throw "many1 match none";
                return arr;
            }
        }
    }
}
skip1.prototype = parsec;


var sep = function(op,sp) {
    return function(state){
        return many(sp.then(op))(state);
    }
}
sep.prototype = parsec;

var sep1 = function(op,sp) {
    return function(state){
        var result = op(state);
        var arr = new Array();
        arr.push(result);
        arr.contact(sep(op,sp)(state));
    }
}
sep1.prototype = parsec;



exports.attempt = attempt;
exports.otherwise  = otherwise;
exports.choice = choice;
exports.either = either;
exports.between = between;
exports.many = many;
exports.many1 = many1;
exports.manyTail = manyTail;
exports.many1Tail = many1Tail;
exports.skip = skip;
exports.skip1 = skip1;
exports.sep = sep;
exports.sep1 = sep1;
