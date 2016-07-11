#!/usr/bin/env node

var fs = require("fs");
var spawn = require("child_process").spawn;

var action = process.argv[2];
var zorFile = process.argv[3];

if (zorFile) { //Because bad error handling without this
    var code = fs.readFileSync(zorFile, "utf8").split("\n").join("");
    var lexedTokens = require("./lexer.js")(code);
    var parsedTree = require("./parser.js")(lexedTokens).parseBlock(0, lexedTokens.length);
    var jsCode = '"use strict";' + require("./compiler.js")(parsedTree);

    switch (action) {
        case "build":
            var outputFile = process.argv[4] || zorFile.split(".")[0] + ".js";
            fs.writeFile(outputFile, jsCode, function(err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("Built " + outputFile + " from " + zorFile + ".");
                }
            });

            break;
        case "run":
            // When Node 5 is more popular
            // fs.mkdtemp('/tmp/zor-', function(err, folder){
            //     var path = folder + "/" + zorFile.split(".")[0] + ".js";
            //     fs.writeFile(path, jsCode, function(err) {
            //         run("node " + path, function(err, stdout, stderr){
            //              //Etc.
            //         });
            //     });
            // });
            // fs.mkdir('tmpzor', function(err, folder){
            //     var path = 'tmpzor/' + zorFile.split(".")[0] + ".js";
            //     fs.writeFile(path, jsCode, function(err) {
            //         run("node " + path, function(err, stdout, stderr){
            //             if (err){
            //                 console.error(err);
            //             }
            //             process.stdout.write(stdout);
            //             if (stderr){
            //                 console.log(stderr)
            //             }
            //             fs.unlinkSync(path);
            //             fs.rmdirSync('tmpzor');
            //         });
            //     });
            // });
            var node = spawn("node");
            node.stdin.write(jsCode);
            node.stdin.end();
            node.stdout.pipe(process.stdout);
            node.stderr.pipe(process.stderr);
            break;
        default:
            console.log("Invalid action.");
    }
} else {
    console.log("Invalid action.")
}
