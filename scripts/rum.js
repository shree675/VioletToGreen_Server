var java = require("java");
var fs = require("fs");
const path = require("path");

const CYC_PATH = path.join(
  __dirname,
  "..",
  "Software_Metrics",
  "Cyclomatic_Complexity"
);

const HAL_PATH = path.join(
  __dirname,
  "..",
  "Software_Metrics",
  "SoftwareMetricsAnalyse"
);

const w1 = 0.4;
const w2 = 0.6;

java.classpath.push(path.join(CYC_PATH, "lib", "out.jar"));
java.classpath.push(path.join(HAL_PATH, "target", "out.jar"));

function calculateRum(sample_code, sample_type) {
  if (sample_type == "class") {
  } else if (sample_type == "method") {
    sample_code = `class Dummy{${sample_code}}`;
  } else if (sample_type == "other") {
    sample_code = `class Dummy{private void dummy(){${sample_code};}}`;
  }

  console.log("CODE : ", sample_code);

  fs.writeFileSync(path.join(CYC_PATH, "input", "Input.java"), sample_code);

  var Cyc = java.import("antlr4.Main");
  var args = [
    path.join(CYC_PATH, "input", "Input.java"),
    path.join(CYC_PATH, "output", "Output.json"),
  ];
  Cyc.mainSync(args);

  var contents = fs.readFileSync(path.join(CYC_PATH, "output", "Output.json"));
  const cycOutput = JSON.parse(contents);
  // const cycOutput = require(path.join(CYC_PATH, "output", "Output.json"));

  var DimensionCalculator = java.import("com.tongji409.DimensionCalculator");
  var args = [path.join(CYC_PATH, "input", "Input.java")];
  DimensionCalculator.mainSync(args);

  contents = fs.readFileSync(path.join(HAL_PATH, "output", "Output.json"));
  const halOutput = JSON.parse(contents);

  // const halOutput = require(path.join(HAL_PATH, "output", "Output.json"));

  console.log("HERE ", sample_code, cycOutput, halOutput);

  const key = Object.keys(cycOutput).at(-1);

  const rum = w1 * cycOutput[key] + w2 * halOutput["HALSTEAD_DIFFICULTY : "];

  return rum;
}

module.exports = { calculateRum };
