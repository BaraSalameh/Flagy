const fs = require("fs");

// Input and output file names
const inputFile = "countries.full.json";   // your REST Countries array
const outputFile = "countries.test.json";

// Load JSON
const countriesList = JSON.parse(fs.readFileSync(inputFile, "utf-8"));

// Transform array
const simplified = countriesList.map(country => {
  const code = country.cca3; // 3-letter country code (e.g., ABW, AFG)
  return {
    [code]: {
      region: country.subregion || null,
      area: country.area,
      borders: country.borders || [],
      languages: country.languages,
      flag: country.flag
    }
  };
});

// Save to file
fs.writeFileSync(outputFile, JSON.stringify(simplified, null, 2));

console.log(`✅ Done! Saved to ${outputFile}`);