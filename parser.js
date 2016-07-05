var code = require("fs").readFileSync("input.zor", "utf8").split("\n").join("");
var lexedTokens = require("./lexer.js")(code);

var block = [];

function getBlockScope(index, type){
    var rightType = "Right" + type;
    var leftType = "Left" + type;
    var depth = 1;
    for (var i = index+1; i<lexedTokens.length;i++){
        if (lexedTokens[i].type == leftType){
            if (type == "Arrow"){
                if (!lexedTokens[i-1] || ["RightArrow", "RightBrace", "RightBracket", "Semicolon"].indexOf(lexedTokens[i-1].type) > -1){
                    depth++;
                }
            }
            else {
                depth++;
            }
        }
        else if (lexedTokens[i].type == rightType){
            if (type == "Arrow"){
                if (!lexedTokens[i-1] || ["RightBrace", "RightBracket", "Semicolon"].indexOf(lexedTokens[i-1].type) > -1){
                    depth--;
                }
            }
            else {
                depth--;
            }
            if (depth == 0){
                return {"start":index, "finish":i};
            }
        }
    }
}

function getConditions(index){
    if (lexedTokens[index+1].type == "LeftParen"){
        var depth = 1;
        for (var i = index+2; i<lexedTokens.length;i++){
            if (lexedTokens[i].type == "LeftParen"){
                depth++;
            }
            else if (lexedTokens[i].type == "RightParen"){
                depth--;
                if (depth == 0){
                    return lexedTokens.slice(index+2, i);
                }
            }
        }
    }
    else {
        console.log("syntax error 3");
    }
}

module.exports = function parseBlock(start, finish){
    var block = [];
    if (blocksValid()){
        for (var i = start; i<finish;i++){
            if (lexedTokens[i].type == "LeftBrace") {
                var scope = getBlockScope(i, "Brace");
                block.push({
                    type: "WhileBlock",
                    conditions: getConditions(i),
                    block: parseBlock(scope.start+1, scope.finish)
                });
                i = scope.finish;
            }
            else if (lexedTokens[i].type == "LeftBracket") {
                var scope = getBlockScope(i, "Bracket");
                if (lexedTokens[i+1].type == "QuestionMark"){
                    if (lexedTokens[i+2].type == "LeftParen"){
                        block.push({
                            type: "ElseIfBlock",
                            conditions: getConditions(i+1),
                            block: parseBlock(scope.start+1, scope.finish)
                        });
                    }
                    else {
                        block.push({
                            type: "ElseBlock",
                            block: parseBlock(scope.start+1, scope.finish)
                        });
                    }
                }
                else {
                    block.push({
                        type: "IfBlock",
                        conditions: getConditions(i),
                        block: parseBlock(scope.start+1, scope.finish)
                    });
                }
                i = scope.finish;
            }
            else if (lexedTokens[i].type == "LeftArrow") {
                if (!lexedTokens[i-1] || ["RightArrow", "RightBrace", "RightBracket", "Semicolon"].indexOf(lexedTokens[i-1].type) > -1){
                    var scope = getBlockScope(i, "Arrow");
                    block.push({
                        type: "FunctionBlock",
                        name: getFunctionInfo(i).name,
                        arguments: getFunctionInfo(i).arguments,
                        block: parseBlock(scope.start+1, scope.finish)
                    });
                    i = scope.finish;
                }
            }
            else if (lexedTokens[i].type == "Identifier"){
                if (!lexedTokens[i-1] || lexedTokens[i-1].type == "RightParen" || lexedTokens[i-1].type == "Semicolon" || lexedTokens[i-1].type == "RightBracket" || lexedTokens[i-1].type == "RightArrow" || lexedTokens[i-1].type == "RightBrace"){
                    if (lexedTokens[i+1].type == "Equals"){
                        block.push({
                            type: "Assignment",
                            identifier: lexedTokens[i].name,
                            value: getExpression(i+1)
                        });
                    }
                    else {
                        console.log("syntax error 4");
                    }
                }
            }
            else if (lexedTokens[i].type == "Print"){
                block.push({
                    type: "Print",
                    expression: getExpression(i)
                });
            }
            else if (lexedTokens[i].type == "Return"){
                block.push({
                    type: "Return",
                    expression: getExpression(i)
                });
            }
            else if (lexedTokens[i].type == "Call"){
                if (!lexedTokens[i-1] || ["RightParen", "RightArrow", "RightBrace", "RightBracket", "Semicolon"].indexOf(lexedTokens[i-1].type) > -1){
                    block.push({
                        type: "Call",
                        expression: getExpression(i-1)
                    });
                }
            }
        }
    }
    else {
        console.log("Unmatching or invalid block definitions");
    }
    return block;
}

function blocksValid(){
    var bracketDepth = 0;
    var braceDepth = 0;
    var arrowDepth = 0;
    var parenDepth = 0;
    for (var i = 0; i < lexedTokens.length; i++){
        var type = lexedTokens[i].type;
        if (type == "LeftBracket"){
            bracketDepth++;
        }
        else if (type == "LeftBrace"){
            braceDepth++;
        }
        else if (type == "LeftParen"){
            parenDepth++;
        }
        else if (type == "LeftArrow"){
            if (!lexedTokens[i-1] ||
            lexedTokens[i-1].type == "Semicolon" ||
            lexedTokens[i-1].type == "RightBracket" ||
            lexedTokens[i-1].type == "RightArrow" ||
            lexedTokens[i-1].type == "RightBrace"){
                if (bracketDepth != 0 || braceDepth != 0 || arrowDepth != 0 || parenDepth != 0){
                    return false;
                }
                arrowDepth++;
            }
            else if (lexedTokens[i-1].type != "Literal" &&
            lexedTokens[i-1].type != "Identifier" &&
            lexedTokens[i-1].type != "RightParen"){
                return false;
            }
        }
        else if (type == "RightBracket"){
            bracketDepth--;
        }
        else if (type == "RightBrace"){
            braceDepth--;
        }
        else if (type == "RightParen"){
            parenDepth--;
        }
        else if (type == "RightArrow"){
            if (!lexedTokens[i-1].type ||
            lexedTokens[i-1].type == "Semicolon" ||
            lexedTokens[i-1].type == "RightBracket" ||
            lexedTokens[i-1].type == "RightBrace"){
                if (bracketDepth != 0 || braceDepth != 0 || arrowDepth != 1 || parenDepth != 0){
                    return false;
                }
                arrowDepth--;
            }
            else if (lexedTokens[i-1].type != "Literal" &&
            lexedTokens[i-1].type != "Identifier" &&
            lexedTokens[i-1].type != "RightParen"){
                console.log("here1")
                return false;
            }
        }
        if (i == lexedTokens.length - 1){
            if (bracketDepth != 0 || braceDepth != 0 || arrowDepth != 0 || parenDepth != 0){
                return false;
            }
            return true;
        }
    }
    return false;
}


var allowInExpression = {
    "Call":"@",
    "LeftParen":"(",
    "RightParen":")",
    "LeftArrow":"<",
    "RightArrow":">",
    "And":"&",
    "Or":"|",
    "Equals":"=",
    "ExclamationPoint":"!"
}

function getExpression(index){
    var expression = "";
    for (var i = index+1; i < lexedTokens.length; i++){
        var type = lexedTokens[i].type;
        if (type == "Operator"){
            expression += lexedTokens[i].symbol;
        }
        else if (type == "Literal"){
            expression += lexedTokens[i].value;
        }
        else if (type == "Identifier"){
            expression += lexedTokens[i].name;
        }
        else if (allowInExpression[type]){
            expression += allowInExpression[type];
        }
        else if (type == "Semicolon"){
            break;
        }
    }
    return require("./evalExpression")(expression);
}

function getFunctionInfo(index){
    var arguments = [];
    var info = {
        name: lexedTokens[index+1].name
    }
    if (info.name && lexedTokens[index+2].type == "LeftParen"){
        var depth = 1;
        var ended = false;
        for (var i = index+3; i < lexedTokens.length; i++){
            var type = lexedTokens[i].type;
            if (type == "LeftParen"){
                depth++;
            }
            else if (type == "RightParen"){
                depth--;
                if (depth == 0){
                    info.arguments = arguments;
                    return info;
                }
            }
            else if (type == "Comma"){
                //Ignore
            }
            else if (type == "Identifier"){
                arguments.push("_"+lexedTokens[i].name);
            }
            else {
                console.log("syntax error 7")
            }
        }
    }
    else {
        console.log("syntax error 6");
    }
}
