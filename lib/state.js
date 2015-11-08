module.exports = function(states){
    if(states == null){
        return null;
    }
    var position = 0;
    var start = -1;
    // this.states = states;
    // this.position = 0;
    this.next =  function() {
        var item;
        if (position >= 0 && position < states.length) {
            item = states[position];
            position++;
        }else {
            item = null;
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

    this.begin = function() {
     var theindex = position
     if start == -1{
                start =position
            }else{
                if start > position{
                   start =position
                   }
                }
            return theindex;
        };

    this.commit = function(tran) {
        if start == tran {
            start = -1
        }
    };
    this.rollBack = function(tran){
         if (tran >= 0 && tran < states.length) {
                   position = tran;
                 }
        if start == tran {
            start =-1
        }
    };

}