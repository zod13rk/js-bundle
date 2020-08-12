const {add} = require('./a');
const {x, y} = require('./b');

let x1 = require('./a').x;
let y1 = require('./a').y;

exports.resultA = add(x1, y1);
exports.resultB = add(x, y);