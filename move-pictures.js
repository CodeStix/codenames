const fs = require("fs");
const path = require("path");

const src = "public/images";
const dest = "public/images-done";

const field = JSON.parse(fs.readFileSync("public/field.json"));

for (const imageFileName of field.images) {
    if (fs.existsSync(path.join(src, imageFileName))) {
        fs.renameSync(path.join(src, imageFileName), path.join(dest, imageFileName));
        console.log("Moved:", imageFileName);
    } else {
        console.log("Doesn't exist:", imageFileName);
    }
}

if (fs.readdirSync(src).length < field.field.length) {
    console.log("Switching folders");
    for (const imageFileName of fs.readdirSync(dest)) {
        fs.renameSync(path.join(dest, imageFileName), path.join(src, imageFileName));
        console.log("Moved back:", imageFileName);
    }
}
