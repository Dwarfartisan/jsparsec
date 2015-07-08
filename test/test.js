var jsParsec = require('../../jsparsec');

var op = jsParsec.getOperator;

var states = ['A','B','C','D','E'];

var state = new jsParsec.state(states);

console.log(state.next());
console.log(state.pos());


console.log(state.next());
console.log(state.pos())

console.log(state.next());
console.log(state.pos())

var pred = function(item){
    if (item === 'E') {
        return true;
    }else{
        return false;
    }
};
console.log(state.nextBy(pred));