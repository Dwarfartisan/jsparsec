module.exports = function(states){
	if(states == null){
		return null;
	}
	this.states = states;
	this.position = 0;
	this.next =  function() {
		var item;
		if (this.position >= 0 && this.position <= this.states.length) {
			item = this.states[this.position];
			this.position++;
		}
		return item;
	};
	this.pos = function() {
		return this.position;
	};
	this.nextBy = function(pred) {
		if (this.position >= 0 && this.position < states.length) {
			var item = this.states[this.position];
			if (pred(item)) {
				return item; 
			} else{
				throw "predicate failed";
			}
		} else {
			return -1;
		}
	};
	this.seekTo = function(to) {
		if (to >= 0 && to < this.states.length) {
			this.position = to;
			return true;
		} else {
			return false;
		}
	};
}