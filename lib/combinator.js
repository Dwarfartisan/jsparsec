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
        //TODO 这里感觉有点不大对劲
        return either(either(op1,op2),op3);
    }
    return function (state) {
        try{
            var resultOp1 = op1(state);
            return resultOp1;
        }catch(err){
            return op2(state);
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

exports.many1 = function() {
    console.log("Many1");
}

exports.between = function() {
    console.log("Between");
}

exports.otherwise = function() {
    console.log("Otherwise");
}

exports.manyTail = function() {
    console.log("ManyTail");
}

exports.many1Tail = function() {
    console.log("Many1Tail");
}

exports.skip = function() {
    console.log("skip");
}

exports.skip1 = function() {
    console.log("skip1");
}

exports.sep = function() {
    console.log("sep");
}

exports.sep1 = function() {
    console.log("sep1");
}