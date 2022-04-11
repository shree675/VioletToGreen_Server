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
    fs.writeFileSync(path.join(CYC_PATH, "input", "Input.java"), sample_code);

    var Cyc = java.import("antlr4.Main");
    var args = [
      path.join(CYC_PATH, "input", "Input.java"),
      path.join(CYC_PATH, "output", "Output.json"),
    ];
    Cyc.mainSync(args);
    const cycOutput = require(path.join(CYC_PATH, "output", "Output.json"));

    var DimensionCalculator = java.import("com.tongji409.DimensionCalculator");
    var args = [path.join(CYC_PATH, "input", "Test1.java")];
    DimensionCalculator.mainSync(args);

    const halOutput = require(path.join(HAL_PATH, "output", "Output.json"));

    const key = Object.keys(cycOutput).at(-1);

    const rum = w1 * cycOutput[key] + w2 * halOutput["HALSTEAD_DIFFICULTY : "];

    return rum;
  }
}

module.exports = { calculateRum };
