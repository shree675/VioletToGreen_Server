const express = require("express");
const bodyParser = require("body-parser");
const rum = require("./scripts/rum");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the VioletTOGreen Server.");
});

const javaCode =
  "public class BubbleSortExample { static void bubbleSort(int[] arr) {  int n = arr.length; int temp = 0;  for(int i=0; i < n; i++){  for(int j=1; j < (n-i); j++){  if(arr[j-1] > arr[j]){  temp = arr[j-1];  arr[j-1] = arr[j];  arr[j] = temp;}}}}}";

app.post("/suggest_comments", (req, res) => {
  console.log(req.body);

  res.send("Recieved....");
});

app.get("/metrics", (req, res) => {
  const result = rum(javaCode, "class");
  res.send(`${result}`);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
