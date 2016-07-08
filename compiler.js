var code = require("fs").readFileSync("input.zor", "utf8").split("\n").join("");
var lexedTokens = require("./lexer.js")(code);
var parsedTree = require("./parser.js")(0, lexedTokens.length);
var allVariables = [];
function evalAssignment(instruction){ //Be careful with function variables that are defined //What about empty functions
    //Watch out redefining argument variables
    var tag = "_";
    if (allVariables.indexOf(instruction.identifier) < 0){
        tag = "let _";
        allVariables.push(instruction.identifier);
    }
    return tag + instruction.identifier + " = " + instruction.value + ";";
}

var ops = {
    "Call":"@",
    "LeftParen":"(",
    "RightParen":")",
    "LeftArrow":"<",
    "RightArrow":">",
    "Comma":",",
    "And":"&",
    "Or":"|",
    "Equals":"=",
    "ExclamationPoint":"!"
}

function evalConditions(conditions){ //TODO: Make expressive
    var condition = "";
    for (var i = 0; i < conditions.length; i++){
        var cond = conditions[i];
        if (cond.type == "Literal"){
            condition += cond.value;
        }
        else if (cond.type == "Identifier"){
            condition += cond.name;
        }
        else if (cond.type == "StringLiteral"){
            condition += cond.value;
        }
        else if (ops[cond.type]){
            condition += ops[cond.type];
        }
        else {
            return "null";
        }
    }
    return require("./evalExpression")(condition);
}

module.exports = function evalBlock(block){
    var cpsCode = "";
    for (var i = 0; i < block.length; i++){
        var instruction = block[i];
        if (instruction.type == "Assignment"){
            cpsCode += evalAssignment(instruction);
        }
        else if (instruction.type == "WhileBlock"){
            cpsCode += "while ("+evalConditions(instruction.conditions)+"){"+evalBlock(instruction.block)+"}";
        }
        else if (instruction.type == "IfBlock"){
            cpsCode += "if ("+evalConditions(instruction.conditions)+"){"+evalBlock(instruction.block)+"}";
        }
        else if (instruction.type == "ElseIfBlock"){
            cpsCode += "else if ("+evalConditions(instruction.conditions)+"){"+evalBlock(instruction.block)+"}";
        }
        else if (instruction.type == "ElseBlock"){
            cpsCode += "else {"+evalBlock(instruction.block)+"}";
        }
        else if (instruction.type == "FunctionBlock"){
            cpsCode += "function _"+instruction.name+"("+instruction.arguments.join(", ")+"){"+evalBlock(instruction.block)+"}";
        }
        else if (instruction.type == "Print"){
            cpsCode += "console.log("+instruction.expression+");"
        }
        else if (instruction.type == "Return"){
            cpsCode += "return "+instruction.expression+";"
        }
        else if (instruction.type == "Call"){
            cpsCode += instruction.expression+";"
        }
    }
    return cpsCode;
}
