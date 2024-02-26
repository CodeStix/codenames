const fs = require("fs");
const path = require("path");

const imagesDir = "public/images";
const outputDir = "public";

const width = 5;
const height = 5;
const teams = 2;
const itemsPerTeam = 7;
const pedestrians = 9;
const murderer = 1;

const field = [];

const imageFileNames = fs.readdirSync(imagesDir).filter((e) => !e.endsWith(".json"));

function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        let r = Math.floor(Math.random() * arr.length);
        let t = arr[i];
        arr[i] = arr[r];
        arr[r] = t;
    }
}

new Array(murderer).fill(0).forEach(() => field.push("MURDERER"));
new Array(pedestrians).fill(0).forEach(() => field.push("PEDESTRIAN"));

const startingTeam = Math.floor(Math.random() * teams);

for (let i = 0; i < teams; i++) {
    new Array(startingTeam === i ? itemsPerTeam + 1 : itemsPerTeam).fill(0).forEach(() => field.push("TEAM_" + i));
}

if (field.length !== width * height) {
    console.error("Invalid final amount, must be ", field.length, width * height);
    process.exit(1);
}

for (let i = 0; i < Math.random() * 10; i++) {
    shuffle(field);
    shuffle(imageFileNames);
}

fs.writeFileSync(
    path.join(outputDir, "field.json"),
    JSON.stringify({
        width,
        height,
        field: field,
        images: imageFileNames.slice(0, width * height),
        startingTeam: "TEAM_" + startingTeam,
    })
);
