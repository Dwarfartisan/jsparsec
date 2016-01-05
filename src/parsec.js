var parsec = function(op){
    if (op == null) {
        op = new Object();
    };
    op.bind = function(handle){
        var item = function(state){
            var val = op(state);
            var re =  handle(val,state);
            return re;
        }
        parsec(item);
        return item;
    };
    op.then = function(handle){
        var item = function(state){
            op(state);
            return handle(state);
        };
        parsec(item);
        return item;
    };
    op.over = function(tail){
        var item = function(state){
            var val = op(state);
            tail(state);
            return val;
        };
        parsec(item);
        return item;
    };
    return op;
};

module.exports = parsec;