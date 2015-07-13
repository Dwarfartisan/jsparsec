module.exports = function(op){
    if (op == null) {
        op = new Object();
    };
    op.bind = function(handle){
        var item = function(state){
            var val = op(state);    
            return handle(val);
        }
        return item;
    };
    op.then = function(){

    };
    op.over = function(tail){
        var item = function(state){
            //这里要不要保证后一个能执行到?
            var val = op(state);
            tail(state);
            return val;
        };
        return item;
    };
    return op;
}