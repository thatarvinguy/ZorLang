# Zor
This is the compiler for the Zor programming language.
## How to Use
Write Zor code in `input.zor`. Then run `node compiler.js` to compile the Zor source to JavaScript. Run `node output.js` to run the compiled JavaScript source.
## Syntax
* `variable = expression;` = `let variable = expression;` or `variable = expression;`
* `{(condition)...}` = `if (condition){...}`
* `{?(condition)...}` = `else if (condition){...}`
* `{?...}` = `else {...}`
* `[(condition)...]` = `while (condition){...}`
* `# expression;` => `console.log(expression);`
* `<functionName(args)...>` = `function functionName(args){...}`
* `@functionName(args);` = `functionName(args);`
* `$ expression;` = `return expression;`
## Important Notes
* An `expression` consists of any set of `literals, variables, conditions, and/or function calls` operated among using `+-*/^%=!><&|` that `currently only evaluates to a number or boolean type`. Other types will soon be added. Example: `(@getNumber(5, 2.3) + (a+2*2))`
* A `condition` is a comparison between `2 or more expressions` using `=!><&|` that evaluates to a `boolean type`. Example: `(index*2)-5 > @getNumber(5, 2.3)`.
