const fs = require("fs");

// Input and output file names
const inputFile = "countries.statistics.json"; // your array of objects
const outputFile = "countries.test.json";

// Load JSON
const countriesList = JSON.parse(fs.readFileSync(inputFile, "utf-8"));

// Merge array of objects into a single object
const simplified = countriesList.reduce((acc, countryObj) => {
  return { ...acc, ...countryObj };
}, {});

// Save to file
fs.writeFileSync(outputFile, JSON.stringify(simplified, null, 2));

console.log(`✅ Done! Saved to ${outputFile}`);
