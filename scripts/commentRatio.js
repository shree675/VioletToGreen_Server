const fs = require("fs");

function commentRatio(codeFile, codeSamples, configs) {

  const singleLinedComments = /[/]{2}.*(?:(?:\r\n|\r|\n) *[/].*)*/gm;
  const multilinedComment = /\/\*[\s\S]*?\*\//gm;
  /* console.log(codeFile);
  console.log(codeSamples);
  console.log(configs); */

  /* console.log(typeof codeFile);
  console.log(typeof codeSamples);
  console.log(typeof configs); */

  //1. for each code sample,
  // extract the inline comments
  // search configs for an exact match
  // find over lap and extract those with more than 70% match
  // for each code sample, return the comment to code ratio

  /* codeLines = codeFile.split('\n');
  for (var codeLine of codeLines) {
    console.log(codeLine); 
    console.log('--------------------');
  } */
  

  for (var codeSample of codeSamples) {
    //console.log(codeSample); 
    var codeSegment = codeFile.substring(codeSample.startOffset, codeSample.endOffset+1);
    var codeLength = codeSegment.length;
    var commentLength = 0;

    const multiLineMatches = codeSegment.matchAll(multilinedComment);
    for (const match of multiLineMatches) {
      console.log(match[0]);
      commentLength += match[0].length;      
    }
    const singleLineMatches = codeSegment.matchAll(singleLinedComments);
    for (const match of singleLineMatches) {
      console.log(match[0]);
      commentLength += match[0].length; 
    }

    console.log(codeSegment);
    codeLength = codeLength - commentLength;
    
    console.log('--------------------');
  }
  
}

codeFile = ``;
codeSamples = "";
configs = "";

(async () => {
  lines = fs.readFileSync("./testing/codeFile.txt", "utf8");
  codeFile = lines.toString();      
})();

(async () => {
  lines = fs.readFileSync("./testing/codeSamples.json");
  codeSamples = JSON.parse(lines);      
  //codeSamples = lines.toString();      
})();

(async () => {
  lines = fs.readFileSync("./testing/configs.json");
  configs = JSON.parse(lines);
  //configs = lines.toString();      
})();

var commentRatios = commentRatio(codeFile, codeSamples, configs);

//module.exports = { commentRatio };
