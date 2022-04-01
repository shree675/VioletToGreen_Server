const javaText = `
public class HelloWorldExample{
  public static void main(String args[]){
    System.out.println("Hello World !");
  }
}
`;

const { parse } = require("java-parser");

const unique_operators = new Set();
const unique_operands = new Set();

const cst = parse(javaText);
let q = [cst];
console.log(q)

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
    console.log(s, s.children);
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