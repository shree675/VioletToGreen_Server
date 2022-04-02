/* var fs = require('fs');
  
// Use fs.readFile() method to read the file
fs.readFile('../Halstead_Testcases/Test0.txt', 'utf8', function(err, data){
    console.log("enter body")
    // Display the file content
    console.log(data.toString());
});
  
console.log('readFile called'); */

//Reading from files in js is async and so annoying!

const javaText = `
class Test0 {
    int a = 2+3;
}
`;

const { parse } = require("java-parser");

const unique_operators = new Set();
const unique_operands = new Set();
const all_operators = [];
const all_operands = [];

const cst = parse(javaText);
let q = [cst];
//console.log(q)

let cur_level = 1;
let next_level = 0;

// all the nodes corresponding to the functions will have a depth of 9
// let height = 9;

while (q.length > 0) {
  let s = q.shift();
  cur_level--;

  process.stdout.write(`${s.name}, `);
  //concole.log(s.name)

  if (s.name === "methodDeclaration") {
    console.log(s);
  }
  if (s.name === "literal") {
    console.log(s, s.children, s.children.location);
  }
  if (s.name === "Identifier") {
    console.log(s, s.children, s.children.children);
  }
  if (s.name === "variableInitializer") {
    console.log(s, s.children, s.children.children);
  }

  if (s.children) {
    for (let [key, val] of Object.entries(s.children)) {
      if (Array.isArray(val)) {
        q = q.concat(val);
        next_level += val.length;
      } else {
        q.push(val);
        next_level++;
      }
    }
  }

  if (cur_level === 0) {
    console.log("\n");
    cur_level = next_level;
    next_level = 0;

    // height--;
    // if (height <= 0) break;
  }
}

/* const { parse, createVisitor } = require("java-ast");
 
const countMethods = (source) => {
  let ast = parse(source);
 
  return createVisitor({
    visitMethodDeclaration: (a) => {console.log(a); return 1},
    defaultResult: () => 0,
    aggregateResult: (a, b) => a + b,
  }).visit(ast);
};
 
console.log(
  countMethods(`
    class A {
      int a;
      void b() {}
      void c() {}
    }
    class B {
      void z() {}
    }
  `),
); // logs 3 */
