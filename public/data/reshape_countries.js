// compress-json.js
const fs = require("fs");

// Input and output file paths
const inputFile = "tw.json";
const outputFile = "tw.output.json";

// Read JSON file
const data = fs.readFileSync(inputFile, "utf8");

// Parse and re-stringify with no spaces
const parsed = JSON.parse(data);
const oneLineJson = JSON.stringify(parsed);

// Write to new file
fs.writeFileSync(outputFile, oneLineJson, "utf8");

console.log(`Compressed JSON written to ${outputFile}`);
