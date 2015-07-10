exports.try = function() {
    var result;
    var index = state.pos();
    try{
        result = op(state);
    } catch (err){
        state.seekTo(index);
        return err;
    }
    return result;
}

exports.either = function(op1,op2) {
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

exports.choice = function (){
    var ops = arguments;
    return function(state){
        var result;
        for(var item in ops){
            try{
                result = ops[item](state);
                break;
            }catch(){
                continue;
            }
            return result;
        }
    }
}

exports.many = function(op) {
    return function(state){
        while(true){
            var arr = new Array();
            try{
                var result = op(state);
                arr.push(result);
            }catch(err){
                return arr;
            }
        }
    }
}

exports.many1 = function(op) {
    return function(state){
        while(true){
            var arr = new Array();
            try{
                var result = op(state);
                arr.push(result);
            }catch(err){
                if (arr.length == 0)
                    throw "many1 match none";
                return arr;
            }
        }
    }
}

exports.between = function(op1,op2,op3) {
    return function(state){
        op1(state);
        var result = op2(state);
        op3();
        return result;
    }
}

exports.otherwise = function() {
    var ops = arguments;
    return function(state){
        var result;
        for(var item in ops){
            try{
                result = ops[item](state);
                break;
            }catch(){
                if (item == 0) {
                    return new Error("first op failed");
                };
                continue;
            }
            return result;
        }
    }
}

exports.manyTail = function(op,tailOp) {
    return function(state){
        many(op).over(tailOp)(state);
    }
}

exports.many1Tail = function() {
    return function(state){
        many1(op).over(tailOp)(state);
    }
}

exports.skip = function(op) {
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

exports.skip1 = function(op) {
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

exports.sep = function(op,sp) {
    return function(state){
        while(true){
            var arr = new Array();
            try{
                var result = either(op(state),sp(state));
                arr.push(result);
            }catch(err){
                return arr;
            }
        }
    }
}

exports.sep1 = function(op,sp) {
    return function(state){
        while(true){
            var arr = new Array();
            try{
                var result = either(op(state),sp(state));
                arr.push(result);
            }catch(err){
                if (arr.length == 0)
                    throw "sep1 match none";
                return arr;
            }
        }
    }
}