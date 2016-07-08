"use strict";

function _loopAdd(_start, _add, _numberOfTimes) {
    let _total = (_start);
    let _index = (0);
    while ((((_index)) < ((_numberOfTimes)))) {
        _total = (((_total)) + ((_add)));
        _index = (((_index)) + ((1)));
    }
    return (_total);
}
let _newValue = (((((_loopAdd((10), (5), (2)))) + ((_loopAdd((20), (10), (3)))))) * ((2)));
if ((((_newValue)) >= ((1000)))) {
    console.log((((_newValue)) + ((" has 4 digits"))));
} else if ((((_newValue)) >= ((100)))) {
    console.log((((_newValue)) + ((" has 3 digits"))));
} else if ((((_newValue)) >= ((10)))) {
    console.log((((_newValue)) + ((" has 2 digits"))));
} else {
    console.log((((_newValue)) + ((" has 1 digit"))));
}

function _getNumberSquared(_number) {
    return Math.pow(((_number)), ((2)));
}

function _squareIsBetween(_toSquare, _num1, _num2) {
    return (((((_getNumberSquared((_toSquare)))) >= ((_num1)))) && ((((_getNumberSquared((_toSquare)))) <= ((_num2)))));
}
let _toSquare = (3);
let _lowerLimit = (0);
let _upperLimit = (8);
if ((_squareIsBetween((_toSquare), (_lowerLimit), (_upperLimit)))) {
    console.log((((((((((_getNumberSquared((_toSquare)))) + ((" is between ")))) + ((_lowerLimit)))) + ((" and ")))) + ((_upperLimit))));
} else {
    console.log((((((((((_getNumberSquared((_toSquare)))) + ((" is not between ")))) + ((_lowerLimit)))) + ((" and ")))) + ((_upperLimit))));
}
let _name = ("Spongepants Squarebob");
if ((((_name)) == (("Name McName")))) {
    console.log(("That's a cool name!"));
} else {
    console.log(((("Get a better name ")) + ((_name))));
}
