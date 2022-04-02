const { parse } = require("java-parser");

// const javaText =

const javaText = `
public class HelloWorldExample{
  int a = 2+3;
}
`;

const cst = parse(javaText);
let q = [cst];

let curl = 1;
let nextl = 0;

// all the nodes corresponding to the functions will have a depth of 9
// let height = 9;

while (q.length > 0) {
  let s = q.shift();
  curl--;

  process.stdout.write(`${s.name},`);
  //concole.log(s.name)

  if (s.name === "methodDeclaration") {
    console.log(s);
  }
  //if (s.name === "methodHeader") {
  //console.log(s);
  //}
  //if (s.name === "methodDeclarator") {
  //console.log(s);
  //}

  if (s.children) {
    for (let [key, val] of Object.entries(s.children)) {
      if (Array.isArray(val)) {
        q = q.concat(val);
        nextl += val.length;
      } else {
        q.push(val);
        nextl++;
      }
    }
  }

  if (curl === 0) {
    console.log("\n");
    curl = nextl;
    nextl = 0;

    // height--;
    // if (height <= 0) break;
  }
}
