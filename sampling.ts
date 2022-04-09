import * as vscode from "vscode";
const { parse } = require("java-parser");

export class Metrics {
  public methods: any = [];
  public classes: any = [];
  public interfaces: any = [];
  public forLoops: any = [];
  public ifElseStatements: any = [];
  public whileLoops: any = [];
  public switchStatements: any = [];
  public doStatements: any = [];
  public initAndDeclStatements: any = [];
  public assignmentStatements: any = [];
  public blocks: any = [];
  public caseBlocks: any = [];

  public getBlocks = (javaText: string) => {
    const cst = parse(javaText);

    let q = [cst];
    let curl = 1;
    let nextl = 0;

    while (q.length > 0) {
      let s = q.shift();
      curl--;

      process.stdout.write(`${s.name},`);

      // if (s.location?.startLine === 95 && s.location?.endLine === 99) {
      //   console.log(`${s.name}`, s.location);
      // }

      // if (s.location?.startLine >= 38 && s.location?.endLine <= 41) {
      //   console.log(`${s.name}`, s.location);
      // }

      switch (s.name) {
        case "constructorDeclaration":
        case "methodDeclaration": {
          this.methods.push(s.location);
          break;
        }
        case "classDeclaration": {
          this.classes.push(s.location);
          break;
        }
        case "forStatement": {
          this.forLoops.push(s.location);
          break;
        }
        case "ifStatement": {
          this.ifElseStatements.push(s.location);
          break;
        }
        case "whileStatement": {
          this.whileLoops.push(s.location);
          break;
        }
        case "switchStatement": {
          this.switchStatements.push(s.location);
          break;
        }
        case "doStatement": {
          this.doStatements.push(s.location);
          break;
        }
        case "interfaceDeclaration": {
          this.interfaces.push(s.location);
          break;
        }
        case "variableDeclarator": {
          this.initAndDeclStatements.push(s.location);
          break;
        }
        case "statementExpression": {
          this.assignmentStatements.push(s.location);
          break;
        }
        case "block": {
          this.blocks.push(s.location);
          break;
        }
        case "switchBlockStatementGroup": {
          this.caseBlocks.push(s.location);
          break;
        }
      }

      if (s.children) {
        for (let [_, val] of Object.entries(s.children)) {
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
        curl = nextl;
        nextl = 0;
      }
    }

    // distinguishing between if, else if and else blocks
    var temp: any[] = [];
    var flag: boolean;

    for (let i = 0; i < this.blocks.length; i++) {
      flag = false;
      for (let j = 0; j < this.ifElseStatements.length; j++) {
        if (
          this.blocks[i].startLine >= this.ifElseStatements[j].startLine &&
          this.blocks[i].endLine <= this.ifElseStatements[j].endLine
        ) {
          flag = true;
          break;
        }
      }
      if (flag) {
        temp.push(this.blocks[i]);
      }
    }
    this.ifElseStatements = [];
    for (let i = 0; i < temp.length; i++) {
      this.ifElseStatements.push(temp[i]);
    }

    // distinguishing case blocks
    temp = [];

    for (let i = 0; i < this.caseBlocks.length; i++) {
      flag = false;
      for (let j = 0; j < this.switchStatements.length; j++) {
        if (
          this.caseBlocks[i].startLine >= this.ifElseStatements[j].startLine &&
          this.caseBlocks[i].endLine <= this.ifElseStatements[j].endLine
        ) {
          flag = true;
          break;
        }
      }
      if (flag) {
        temp.push(this.caseBlocks[i]);
      }
    }

    // this.forLoops = this.removeNested(this.forLoops, this.forLoops);

    // console.log(this.ifElseStatements);

    // console.log(this.switchStatements);
    // console.log(this.methods);
  };

  removeNested = (innerArray: any, outerArray: any) => {
    var temp: any[] = [];
    var flag: boolean;

    for (let i = 0; i < innerArray.length; i++) {
      flag = false;
      for (let j = 0; j < outerArray.length; j++) {
        if (
          (innerArray[i].startLine > outerArray[j].startLine &&
            innerArray[i].endLine < outerArray[j].endLine) ||
          (innerArray[i].startCharacter > outerArray[j].startCharacter &&
            innerArray[i].startLine === outerArray[j].startLine) ||
          (innerArray[i].endCharacter < outerArray[j].endCharacter &&
            innerArray[i].endLine === outerArray[j].endLine)
        ) {
          if (i !== j) {
            flag = true;
            break;
          }
        }
      }
      if (!flag) {
        temp.push(innerArray[i]);
      }
    }
    innerArray = [];
    for (let i = 0; i < temp.length; i++) {
      innerArray.push(temp[i]);
    }
    return innerArray;
  };
}
