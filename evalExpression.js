"use strict";
String.prototype.isNumeric = function() {
    return (!isNaN(parseFloat(this)) && isFinite(this));
}
String.prototype.isVar = function() {
    return this.match(/[a-zA-Z0-9]/i) && this.substring(0, 1).match(/[a-zA-Z]/i);
}

String.prototype.isFunc = function() {
    return this.indexOf("@") > -1;
}

Array.prototype.clean = function() {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === "") {
            this.splice(i, 1);
        }
    }
    return this;
}

function iTp(infix) {
    var outputQueue = "";
    var operatorStack = [];
    var operators = {
        "^": {
            precedence: 4,
            associativity: "Right"
        },
        "/": {
            precedence: 3,
            associativity: "Left"
        },
        "%": {
            precedence: 3,
            associativity: "Left"
        },
        "*": {
            precedence: 3,
            associativity: "Left"
        },
        "+": {
            precedence: 2,
            associativity: "Left"
        },
        "-": {
            precedence: 2,
            associativity: "Left"
        },
        ">": {
            precedence: 1,
            associativity: "Left"
        },
        "<": {
            precedence: 1,
            associativity: "Left"
        },
        "<=": {
            precedence: 1,
            associativity: "Left"
        },
        ">=": {
            precedence: 1,
            associativity: "Left"
        },
        "==": {
            precedence: 1,
            associativity: "Left"
        },
        "!=": {
            precedence: 1,
            associativity: "Left"
        },
        "&&": {
            precedence: 0,
            associativity: "Left"
        },
        "||": {
            precedence: 0,
            associativity: "Left"
        }
    }
    infix = infix.replace(/\s+/g, "");
    if (infix.substring(0, 1) == "-" || infix.substring(0, 1) == "+" ) {
        infix = "0" + infix;
    }
    infix = infix.split(/([\<\>\&\|\!\=\%\+\-\*\/\^\(\)])/).clean();
    for (var i = 0; i < infix.length; i++) {
        var token = infix[i];
        if (token.substring(0, 1) == "@"){
            var end = 0;
            var depth = 0;
            for (var j = i+1; j < infix.length; j++){
                if (infix[j] == "("){
                    depth++;
                }
                else if (infix[j] == ")"){
                    depth--;
                    if (depth == 0){
                        end = j + 1;
                        break;
                    }
                }
            }
            var added = infix.slice(i+1, end).join("");
            var args = [];
            var parenDepth = 0;
            var lastSubs = 1;
            for (var j = 0; j < added.length; j++){
                var char = added.charAt(j);
                if (char == "(") {
                    parenDepth++;
                }
                else if(char == ")") {
                    parenDepth--;
                    if (parenDepth == 0){
                        var toAdd = added.substring(lastSubs, j);
                        if (toAdd) args.push(infixToJS(toAdd));
                        lastSubs = j + 1; //not needed
                        break;
                    }
                }
                if (char == "," && parenDepth == 1){
                    var toAdd = added.substring(lastSubs, j);
                    if (toAdd) args.push(infixToJS(toAdd));
                    lastSubs = j + 1;
                }

            }
            outputQueue += (token + "(" + args.join(",") + ")") + " ";
            i = end - 1;
        }
        else if (token.isNumeric() || token.isVar()) {
            outputQueue += token + " ";
        }
        else if ("^*/+-%<>=!|&".indexOf(token) !== -1) {//Fix repetition, THIS IS MESSY
            var nextToken = infix[i+1];
            if (token == "<" || token == ">"){
                if (nextToken == "="){
                    var o1 = token + "=";
                    var o2 = operatorStack[operatorStack.length - 1];
                    while ("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
                        outputQueue += operatorStack.pop() + " ";
                        o2 = operatorStack[operatorStack.length - 1];
                    }
                    operatorStack.push(o1);
                    i++;
                }
                else {
                    var o1 = token;
                    var o2 = operatorStack[operatorStack.length - 1];
                    while ("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
                        outputQueue += operatorStack.pop() + " ";
                        o2 = operatorStack[operatorStack.length - 1];
                    }
                    operatorStack.push(o1);
                }
            }
            else if (token == "!" || token == "="){
                if (nextToken == "="){
                    var o1 = token + "=";
                    var o2 = operatorStack[operatorStack.length - 1];
                    while ("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
                        outputQueue += operatorStack.pop() + " ";
                        o2 = operatorStack[operatorStack.length - 1];
                    }
                    operatorStack.push(o1);
                    i++;
                }
                else {
                    console.log("syntax error 10");
                }
            }
            else if (token == "|" || token == "&"){
                if (nextToken == token){
                    var o1 = token + token;
                    var o2 = operatorStack[operatorStack.length - 1];
                    while ("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
                        outputQueue += operatorStack.pop() + " ";
                        o2 = operatorStack[operatorStack.length - 1];
                    }
                    operatorStack.push(o1);
                    i++;
                }
                else {
                    console.log("syntax error 11");
                }
            }
            else {
                var o1 = token;
                var o2 = operatorStack[operatorStack.length - 1];
                while ("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
                    outputQueue += operatorStack.pop() + " ";
                    o2 = operatorStack[operatorStack.length - 1];
                }
                operatorStack.push(o1);
            }


        } else if (token === "(") {
            operatorStack.push(token);
        } else if (token === ")") {
            while (operatorStack[operatorStack.length - 1] !== "(") {
                outputQueue += operatorStack.pop() + " ";
            }
            operatorStack.pop();
        }
    }
    while (operatorStack.length > 0) {
        outputQueue += operatorStack.pop() + " ";
    }
    return outputQueue;
}

function AST(inp) {
    let input = inp.split(" ").clean();
    let stack = []
    while (input.length > 0) {
        let elem = input[0];
        if (elem.isNumeric()) {
            stack.push({
                type: "Constant",
                value: elem
            });
        }
        else if (elem.isFunc()) {
            stack.push({
                type: "Function",
                call: elem.substring(1)
            });
        }
        else if (elem.isVar()) {
            stack.push({
                type: "Variable",
                name: elem
            });
        } else if (["^","*","/","+","-","%","<",">","<=",">=","==","||","&&"].indexOf(elem) !== -1) {
            let a = stack.pop();
            let b = stack.pop();
            stack.push({
                type: "Operator",
                left: b,
                right: a,
                operator: elem
            });
        }
        input = input.slice(1);
    }
    return stack[0];
}

function ASTtoJS(ast){
    if (ast.type == "Constant"){
        return "(" + ast.value + ")";
    }
    else if (ast.type == "Variable"){
        if (ast.name == "true" || ast.name == "false"){//keywords of sorts
            return "("+ast.name+")";
        }
        return "(_" + ast.name + ")";
    }
    else if (ast.type == "Function"){
        return "(_" + ast.call + ")";
    }
    else if (ast.type == "Operator"){
        if (ast.operator == "^"){
            return "Math.pow(("+ASTtoJS(ast.left)+"),("+ASTtoJS(ast.right)+"))"
        }
        return "((" + ASTtoJS(ast.left) + ")" + ast.operator + "(" + ASTtoJS(ast.right) + "))";
    }
}

function infixToJS(infix){
    return ASTtoJS(AST(iTp(infix)));
}

module.exports = function infixToJS(infix){
    return ASTtoJS(AST(iTp(infix)));
}
