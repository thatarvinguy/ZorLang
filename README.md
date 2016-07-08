# Zor
This is the compiler for the Zor programming language.

## How to Use
`npm install zor`
Use any of the following commands to build/run Zor code:
`zor run input.zor` to run input.zor.
`zor build input.zor` to compile input.zor to input.js file.
`zor build input.zor customfile.js` to compile input.zor to customfile.js file.

## Syntax
* `variable = expression;` = `let variable = expression;` or `variable = expression;`
* `{(condition)...}` = `if (condition){...}`
* `{?(condition)...}` = `else if (condition){...}`
* `{?...}` = `else {...}`
* `[(condition)...]` = `while (condition){...}`
* `# expression;` = `console.log(expression);`
* `<functionName(args)...>` = `function functionName(args){...}`
* `@functionName(args);` = `functionName(args);`
* `$ expression;` = `return expression;`

## Important Notes
* An `expression` consists of any set of `literals, variables, conditions, and/or function calls` operated among using `+-*/^%=!><&|` that currently only evaluates to a `number, boolean, or string` data type. Other types will soon be added. Example: `"Here's a cool number: " + (@getNumber(5, 2.3) + (a+2*2))`
* A `condition` is a comparison between `2 or more expressions` using `=!><&|` that evaluates to a `boolean type`. Example: `(index*2)-5 > @getNumber(5, 2.3)`.
