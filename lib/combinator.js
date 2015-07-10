var operator = require("./operator.js");

var attempt = function(op) {
    return function(state){
        var result;
        var index = state.pos();
        try{
            result = op(state);
        } catch (err){
            console.log("into catch");
            state.seekTo(index);
            return new Error("attempt failed");
        }
        return result;     
    }
}
attempt.prototype = operator;



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
either.prototype = operator;


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
choice.prototype = operator;



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
many.prototype = operator;

var many1 = function(op) {
    return function(state){
        var result = op(state);
        var arr = new Array();
        arr.push(result);
        arr.contact(many(op)(state));
    }
}
many1.prototype = operator;


var between = function(op1,op2,op3) {
    return function(state){
        op1(state);
        var result = op2(state);
        op3(state);
        return result;
    }
}
between.prototype = operator;

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
otherwise.prototype = operator;

var manyTail = function(op,tailOp) {
    return function(state){
        many(op).over(tailOp)(state);
    }
}
manyTail.prototype = operator;

var many1Tail = function() {
    return function(state){
        many1(op).over(tailOp)(state);
    }
}
many1Tail.prototype = operator;

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
skip.prototype = operator;


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
skip1.prototype = operator;


var sep = function(op,sp) {
    return function(state){
        return many(sp.then(op))(state);
    }
}
sep.prototype = operator;

var sep1 = function(op,sp) {
    return function(state){
        var result = op(state);
        var arr = new Array();
        arr.push(result);
        arr.contact(sep(op,sp)(state));
    }
}
sep1.prototype = operator;



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