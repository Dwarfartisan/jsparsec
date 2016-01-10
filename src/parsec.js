var parsec = function(parser){
    if (parser == null) {
        parser = new Object();
    };
    parser.bind = function(handle){
        var item = function(state){
            var val = parser(state);
            var re =  handle(val,state);
            return re;
        }
        parsec(item);
        return item;
    };
    parser.then = function(handle){
        var item = function(state){
            parser(state);
            return handle(state);
        };
        parsec(item);
        return item;
    };
    parser.over = function(tail){
        var item = function(state){
            var val = parser(state);
            tail(state);
            return val;
        };
        parsec(item);
        return item;
    };
    return parser;
};

module.exports = parsec;