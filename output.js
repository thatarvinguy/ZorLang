"use strict";

function _loopAdd(_start, _add, _numberOfTimes) {
    let _total = (_start);
    let _index = (0);
    while (_index < _numberOfTimes) {
        _total = (((_total)) + ((_add)));
        _index = (((_index)) + ((1)));
    }
    return (_total);
}
let _newValue = (((((_loopAdd((10), (5), (2)))) + ((_loopAdd((20), (10), (3)))))) * ((2)));
if (_newValue >= 1000) {
    console.log((4));
} else if (_newValue >= 100) {
    console.log((3));
} else if (_newValue >= 10) {
    console.log((2));
} else {
    console.log((1));
}
console.log((_newValue));
