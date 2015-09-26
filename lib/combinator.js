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


var between = function(open, close, p) {
    var fun = function(state){
        open(state);
        var result = p(state);
        close(state);
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
    //这里P执行出错了 就直接抛出去
    var fun = p.bind(function(x,state){
        var arr = new Array();
        arr.push(x);
        while(true)
        {
            var at = attempt(p);
            try{
                var val = at(state);
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


var many1Tail = function(p,tailOp) {
    var fun = function(state){
        many1(p).over(tailOp)(state);
    };
    parsec(fun);
    return fun;
};


var skip1 = function(p) {
    var fun = p.bind(function(x,state){
        var arr = new Array();
        while(true)
        {
            try{
                var val = p(state);
            }catch(err){
                return;
            }
        }
    });
    parsec(fun);
    return fun;
};


var skip = function(p) {
    var fun = function(state){
        var sk = either(skip1(attempt(p)),atom.pack(Array(0)));
        var re = sk(state);
        return re;
    };
    parsec(fun);
    return fun;
};


var sep = function(p, s) {
    var fun = function(state){
        var op = either(sep1(p, s), atom.pack(new Array(0)));
        var re = op(state);
        return re;
    };
    parsec(fun);
    return fun;
};


var sep1 = function(p, s) {
    var fun = function(state){
        var op = p.bind(function(x,state){
            var temp = new Array();
            temp.push(x);
            var re = temp.concat(many(s.then(p))(state));
            return re;
        });
        var result = op(state);
        return result;
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
