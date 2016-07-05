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
* An `expression` consists of any set of `literals, variables, and/or function calls` operated among using `+-*/^%` that `currently only evaluates to a number type`. Other types will soon be added. Example: `(@getNumber(5, 2.3) + (a+2*2))`
* A `condition` (*as of now*) is a comparison between `two literals, two variables, or one literal and one variable` using `=!><&|` that evaluates to a `boolean type`. Example: `index < 100`. In the future when the boolean variable type is added, conditions will be able to compare complex expressions such as `(index*2)-5 > @getNumber(5, 2.3)`. This type of condition is not yet supported, but it will be soon.
