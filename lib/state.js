var index = 0;
var states = new Array();
exports.next = function() {
    if (index >= 0 && index <= Array.length) {
        var item = states[index];
        index++;
    } else {
        return null;
    }
}

exports.pos = function() {
    return index;
}

exports.seekTo = function(to) {
    if (to >= 0 && to < states.length) {
        index = to;
        return true;
    } else {
        return false;
    }
}

exports.nextBy = function(pred) {
    if (to >= 0 && to < states.length) {
        index = to;
        var item = states[index];
        if (pred(item)) {
            return item; 
        } else{
            throw "predicate failed";
        }
    } else {
        return -1;
    }
}

exports.state = function(states){
    this.states = states;
}