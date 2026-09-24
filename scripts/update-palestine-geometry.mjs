import { readFile, writeFile } from "node:fs/promises";

const palestineSourceUrl =
    "https://orthophotos.geomolg.ps/adaptor/rest/services/HistoricalPalestine_02/MapServer/3/query?where=OBJECTID%20IN%20%2810%2C12%2C13%29&outFields=OBJECTID&returnGeometry=true&outSR=4326&f=json";
const syriaSourceUrl =
    "https://orthophotos.geomolg.ps/adaptor/rest/services/HistoricalPalestine_02/MapServer/3/query?where=OBJECTID%20IN%20%285%2C8%29&outFields=OBJECTID&returnGeometry=true&outSR=4326&f=json";
const lebanonSourceUrl =
    "https://orthophotos.geomolg.ps/adaptor/rest/services/HistoricalPalestine_02/MapServer/3/query?where=OBJECTID%3D6&outFields=OBJECTID&returnGeometry=true&outSR=4326&f=json";
const jordanSourceUrl =
    "https://orthophotos.geomolg.ps/adaptor/rest/services/HistoricalPalestine_02/MapServer/3/query?where=OBJECTID%3D11&outFields=OBJECTID&returnGeometry=true&outSR=4326&f=json";
const egyptSourceUrl =
    "https://orthophotos.geomolg.ps/adaptor/rest/services/HistoricalPalestine_02/MapServer/3/query?where=OBJECTID%3D2&outFields=OBJECTID&returnGeometry=true&outSR=4326&f=json";
const unionUrl =
    "https://orthophotos.geomolg.ps/adaptor/rest/services/Utilities/Geometry/GeometryServer/union";
const atlasPath = new URL("../public/data/countries.geo.json", import.meta.url);
function normalizeRing(ring) {
    return ring.map(([x, y]) => [Number(x.toFixed(6)), Number(y.toFixed(6))]);
}

async function buildFeature({ label, sourceUrl, expectedParts, properties }) {
    const response = await fetch(sourceUrl);
    if (!response.ok)
        throw new Error(`${label} request failed: ${response.status}`);
    const source = await response.json();
    if (source.features?.length !== expectedParts)
        throw new Error(`${label} returned an unexpected number of features`);

    const unionRequest = new URLSearchParams({
        f: "json",
        sr: "4326",
        geometries: JSON.stringify({
            geometryType: "esriGeometryPolygon",
            geometries: source.features.map((item) => item.geometry),
        }),
    });
    const unionResponse = await fetch(unionUrl, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: unionRequest,
    });
    if (!unionResponse.ok)
        throw new Error(`${label} union failed: ${unionResponse.status}`);
    const union = await unionResponse.json();
    const rings = union.geometry?.rings;
    if (!Array.isArray(rings) || !rings.length)
        throw new Error(`${label} union returned no polygon rings`);

    return {
        sourcePoints: rings.reduce((sum, ring) => sum + ring.length, 0),
        feature: {
            type: "Feature",
            properties,
            geometry: {
                type: "Polygon",
                coordinates: rings.map(normalizeRing),
            },
        },
    };
}

const [palestine, syria, lebanon, jordan, egypt] = await Promise.all([
    buildFeature({
        label: "Historical Palestine",
        sourceUrl: palestineSourceUrl,
        expectedParts: 3,
        properties: { name: "Palestine", ISO3: "PSE", ISO2: "PS" },
    }),
    buildFeature({
        label: "Syria and the Golan Heights",
        sourceUrl: syriaSourceUrl,
        expectedParts: 2,
        properties: { name: "Syria", ISO3: "SYR", ISO2: "SY" },
    }),
    buildFeature({
        label: "Lebanon",
        sourceUrl: lebanonSourceUrl,
        expectedParts: 1,
        properties: { name: "Lebanon", ISO3: "LBN", ISO2: "LB" },
    }),
    buildFeature({
        label: "Jordan",
        sourceUrl: jordanSourceUrl,
        expectedParts: 1,
        properties: { name: "Jordan", ISO3: "JOR", ISO2: "JO" },
    }),
    buildFeature({
        label: "Egypt",
        sourceUrl: egyptSourceUrl,
        expectedParts: 1,
        properties: { name: "Egypt", ISO3: "EGY", ISO2: "EG" },
    }),
]);

const atlas = await readFile(atlasPath, "utf8");
const lines = atlas.split(/\r?\n/);
function replaceFeature({ feature }) {
    const code = feature.properties.ISO2;
    const matches = lines
        .map((line, index) => (line.includes(`"ISO2":"${code}"`) ? index : -1))
        .filter((index) => index >= 0);
    if (!matches.length)
        throw new Error(`The atlas has no ${code} feature to replace`);
    lines[matches[0]] = `    ${JSON.stringify(feature)},`;
    for (const index of matches.slice(1).reverse()) lines.splice(index, 1);
}

replaceFeature(palestine);
replaceFeature(syria);
replaceFeature(lebanon);
replaceFeature(jordan);
replaceFeature(egypt);
await writeFile(atlasPath, lines.join("\n"));

for (const result of [palestine, syria, lebanon, jordan, egypt])
    console.log(
        `Updated ${result.feature.properties.name}: ${result.sourcePoints} source points -> ${result.feature.geometry.coordinates.reduce((sum, ring) => sum + ring.length, 0)} atlas points`,
    );
