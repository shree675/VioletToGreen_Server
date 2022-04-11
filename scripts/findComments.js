function commentRatio(codeFile, codeSamples, configs) {
  console.log(codeFile);
  console.log(codeSamples);
  console.log(configs);
  //1. for each code sample,
  // extract the inline comments
  // search configs for an exact match
  // find over lap and extract those with more than 70% match
  // for each code sample, return the comment to code ratio
}

/* codeFile = ``;
codeSamples = "";
configs = ""; */

// var commentRatios = commentRatio(codeFile, codeSamples, configs);

module.exports = { commentRatio };
