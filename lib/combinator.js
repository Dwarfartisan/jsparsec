var parsec = require('./parsec.js');
var atom = require('./atom.js');

var attempt = function(p) {
    var fun = function(state){
        var result;
        var index = state.pos();
        try{
            result = p(state);
        } catch (err){
            state.seekTo(index);
            throw err;
        }
        return result;
    };
    parsec(fun);
    return fun;
}


var between = function(op1,op2,op3) {
    var fun = function(state){
        op1(state);
        var result = op2(state);
        op3(state);
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
    var ops = arguments;
    var fun = function(state){
        var result = null;
        for(var index in ops){
            try{
                result = ops[index](state);
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
    //这里P执行出错了 就直接抛出去吗?
    var fun = p.bind(function(x){
        var arr = new Array();
        arr.push(x);
        while(true)
        {
            try{
                var val = p(state);
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



var manyTail = function(op,tailOp) {
    var fun = function(state){
        many(op).over(tailOp)(state);
    };
    parsec(fun);
    return fun;
};


var many1Tail = function() {
    var fun = function(state){
        many1(op).over(tailOp)(state);
    };
    parsec(fun);
    return fun;
};


var skip = function(op) {
    var fun = function(state){
        while(true){
            try{
                var result = op(state);
            }catch(err){
                return arr;
            }
        }
    };
    parsec(fun);
    return fun;
};


var skip1 = function(p) {
    var fun = function(state){
        while(true){
            try{
                p(state);
            }catch(err){
                if (arr.length == 0)
                    throw "many1 match none";
                return arr;
            }
        }
    };
    parsec(fun);
    return fun;
};



var sep = function(op,sp) {
    var fun = function(state){
        return many(sp.then(op))(state);
    };
    parsec(fun);
    return fun;
};
sep.prototype = parsec;

var sep1 = function(op,sp) {
    var fun = function(state){
        var result = op(state);
        var arr = new Array();
        arr.push(result);
        arr.contact(sep(op,sp)(state));
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
exports.manyTail = manyTail;
exports.many1Tail = many1Tail;
exports.skip = skip;
exports.skip1 = skip1;
exports.sep = sep;
exports.sep1 = sep1;