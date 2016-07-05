"use strict";
var code = require("fs").readFileSync("input.zor", "utf8");

module.exports = function lex(code) {
    let result = [];
    let index = 0;
    loop:
    while (index < code.length) {
        if (/\s/.test(code[index])) {
            index++;
            continue;
        }
        if (oneChar[code[index]]) {
            result.push({
                type: oneChar[code[index]]
            });
            index++;
            continue;
        }
        if (literalRegex.test(code[index])) {
            let start = index;
            while (literalRegex.test(code[index])) {
                index++;
            }
            result.push({
                type: "Literal",
                value: parseInt(code.substring(start, index))
            });
            continue;
        }
        if (operators.indexOf(code[index]) != -1) {
            result.push({
                type: "Operator",
                symbol: code[index]
            });
            index++;
            continue;
        }

        for (let word in words) {
            if (code.substring(index).startsWith(word)) {
                result.push({
                    type: words[word]
                });
                index += word.length;
                continue loop;
            }
        }
        if (identStartRegex.test(code[index])) {
            let start = index;
            while (identRegex.test(code[index])) {
                index++
            }
            result.push({
                type: "Identifier",
                name: code.substring(start, index)
            });
            continue;
        }
        console.log("syntax error");
        process.exit(1);
    }
    return result;
};

const literalRegex = /^((\d+\.?\d*)|(\d*\.?\d+))$/;
const identStartRegex = /[a-zA-Z]/;
const identRegex = /[a-zA-Z0-9]/;

const oneChar = {
    "(": "LeftParen",
    ")": "RightParen",
    "=": "Equals",
    ";": "Semicolon",
    "{": "LeftBracket",
    "}": "RightBracket",
    "[": "LeftBrace",
    "]": "RightBrace",
    "<": "LeftArrow",
    ">": "RightArrow",
    ",": "Comma",
    "&": "And",
    "|": "Or",
    "#": "Print",
    "@": "Call",
    "$": "Return",
    "?": "QuestionMark",
    "!": "ExclamationPoint"
};

const operators = [
    "+",
    "-",
    "*",
    "/",
    "^",
    "%",
    "=",
    "<",
    ">"
];

const words = {
    "output": "Output",
    "input": "Input"
};
