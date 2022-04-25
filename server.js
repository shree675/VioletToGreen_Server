const express = require("express");
const bodyParser = require("body-parser");
const { CodeSampler } = require("./scripts/codeSampler");
const { calculateRum } = require("./scripts/rum");
const { commentRatio } = require("./scripts/commentRatio");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the VioletTOGreen Server.");
});

const javaCode =
  "public class BubbleSortExample { static void bubbleSort(int[] arr) {  int n = arr.length; int temp = 0;  for(int i=0; i < n; i++){  for(int j=1; j < (n-i); j++){  if(arr[j-1] > arr[j]){  temp = arr[j-1];  arr[j-1] = arr[j];  arr[j] = temp;}}}}}";

app.post("/suggest_comments", (req, res) => {
  console.log(req.body);

  const code = req.body.code;
  const configs = req.body.configs;

  // console.log(CodeSampler);
  var codeSampler = new CodeSampler();

  const [allBlocks, allBlocksTypes] = codeSampler.getBlocks(code);

  var allBlocksRum = [];

  for (var i = 0; i < allBlocks.length; i++) {
    const block = allBlocks[i];
    const blockType = allBlocksTypes[i];

    const codeSample = code.substring(block.startOffset, block.endOffset + 1);

    const rum_metric = calculateRum(codeSample, blockType);

    // console.log(codeSample, rum_metric);

    allBlocksRum.push(rum_metric);
  }

  console.log(allBlocksRum);

  const commentRatios = commentRatio(code, allBlocks, configs);

  /**
   * The server takes as input through the API, the entire java file and the configs file which contains the links
   * We take the Java file and sample it using java-parser in a similar manner to what has been done in client side for automatic linking
   * These samples are returned along with their types from codeSampler.js
   * For all these samples or blocks, we now obtain the code to comment ratio by making use of the links information given in the configs
   * We get the RUM metric for each of these blocks by taking a weighted sum of the Halstead metric and Cyclomatic Complexity
   * Based on the RUM metric and the code to comment ration, we decide on whether an 'insert comment' suggestion is required or not
   * This direction, along with the blocks is sent back to the client for integration with the GUI
   */

  /**
   * Assumption:
   * allBlocks is a list of block info objects: it must be returned to client for reference
   * commentRatios is a list of code to comment ratios for each of the blocks, corresponding to allBlocks
   * allBlocksRum is a list of RUM metric scores for each of the blocks, correspondihng to allBlocks
   *
   * Grasp score
   * We evaluate a score out of 10, with 10 indicating that it is substantially readable and there is no need to insert a comment
   * 1 indicates that it is barely readable and a comment should be inserted
   * On the client side, a threshold between 1 and 10 can be fixed according to which suggestions will be provided in the VS code extension GUI
   * Note: Code to Comment ratio can be any real number >= 0
   * Note: RUM metric can be any real number >= 0
   *
   * A higher comment to code ratio indicates better readability/understandability, hence a higher Grasp score
   * Assumption: The maximum comment to code ratio is 2. Hence a normalized comment ration is given by commentRatio/2
   * A lower RUM metric indicates better readability?understandability and hence, better Grasp metric
   * Assumption: The maximum RUM metric on average is 2*no_of_lines. Hence a normalized rum metric is RUM_core/max_rum_score
   *
   * Hence the grasp metric is given by 10* normalized_comment_ratio/normalized_rum_metric
   */

  const lines_of_code = javaCode.split("\n").length;
  const MAX_COMMENT_RATIO = 2;
  const MAX_RUM_SCORE_MULTIPLIER = 2;
  const MAX_RUM_SCORE = MAX_RUM_SCORE_MULTIPLIER * lines_of_code;

  var suggestionsOutput = [];

  for (let i = 0; i < allBlocks.length; i++) {
    let normalizedCommentRatio = commentRatios[i] / MAX_COMMENT_RATIO;
    let normalizedRumMetric = allBlocksRum[i] / MAX_RUM_SCORE;
    var graspScore = (10 * normalizedCommentRatio) / normalizedRumMetric;
    suggestionsOutput.append(graspScore);
  }

  res.send("Recieved : ", allBlocks, suggestionsOutput);
});

app.get("/metrics", (req, res) => {
  const result = rum(javaCode, "class");
  res.send(`${result}`);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
