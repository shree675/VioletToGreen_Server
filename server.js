const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
var java = require("java");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the VioletTOGreen Server.");
});

const CYC_PATH = path.join(
  __dirname,
  "Software_Metrics",
  "Cyclomatic_Complexity"
);

java.classpath.push(path.join(CYC_PATH, "lib", "out.jar"));
java.classpath.push(
  path.join(
    __dirname,
    "Software_Metrics",
    "SoftwareMetricsAnalyse",
    "target",
    "out.jar"
  )
);

app.post("/cyc", (req, res) => {
  const code = req.body["code"];
  fs.writeFileSync(path.join(CYC_PATH, "input", "Input.java"), code);

  var Main = java.import("antlr4.Main");
  var args = [
    path.join(CYC_PATH, "input", "Input.java"),
    path.join(CYC_PATH, "output", "Output.json"),
  ];
  Main.mainSync(args);
  const output = require(path.join(CYC_PATH, "output", "Output.json"));
  res.json(output);
});

app.get("/se", (req, res) => {
  var DimensionCalculator = java.import("com.tongji409.DimensionCalculator");
  var args = [path.join(CYC_PATH, "input", "Test1.java")];
  DimensionCalculator.mainSync(args);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
