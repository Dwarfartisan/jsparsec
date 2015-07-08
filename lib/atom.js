var arr = new Array();
arr[0] = 10;

exports.one = function() {
    console.log(arr[0]);
}

exports.equal = function() {
    console.log("Equal");
}
exports.notEqual = function() {
    console.log("NotEqual");
}

exports.oneOf = function() {
    console.log("OneOf");
}
exports.noneOf = function() {
    console.log("NoneOf run");
}

exports.pack = function() {
    console.log("Pack run");
}

exports.fail = function() {
    console.log("Fail");
}