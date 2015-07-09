module.exports = function(states){
    if(states == null){
        return null;
    }
    var position = 0;
    // this.states = states;
    // this.position = 0;
    this.next =  function() {
        var item;
        if (position >= 0 && position <= states.length) {
            item = states[position];
            position++;
        }else {
            item = new Error("out of bounds");
        }
        return item;
    };
    this.pos = function() {
        return position;
    };
    this.nextBy = function(pred) {
        if (position >= 0 && position < states.length) {
            var item = states[position];
            if (pred(item)) {
                return item; 
            } else{
                throw new Error("predicate failed");
            }
        } else {
            return -1;
        }
    };
    this.seekTo = function(to) {
        if (to >= 0 && to < states.length) {
            position = to;
            return true;
        } else {
            return false;
        }
    };
}