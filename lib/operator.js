module.exports = function(op , state){
    this.state = state;
    if (op == null) {
        op = new Object();
    };
    op.bind = function(handle){
        var item = function(state){
            var val = op(state);    
            return handle(val);
        }
        return item;
    }
    op.then = function(){

    }
    op.over = function(){

    }
    return op;
}
