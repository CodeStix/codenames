const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

// const inputDir = "/home/stijn/Pictures/Nieuwjaar 2023-2024/Stijn2";
const inputDir = "/mnt/e/Documents/NL Weekend 6-8dec 2024/Codename fotos";
const outputDir = "./public/images";

const outputFiles = new Set();

for (const filePath of fs.readdirSync(inputDir)) {
    if (!filePath.includes(".")) {
        // Is dir
        continue;
    }

    const fullFilePath = path.join(inputDir, filePath);

    const file = path.parse(fullFilePath);
    const extLower = file.ext.toLowerCase();

    const hash = execSync(`sha1sum "${fullFilePath}"`).toString("utf-8").split(" ")[0];
    console.log(file.name, hash);

    switch (extLower) {
        case ".jpg":
        case ".jpeg":
        case ".gif":
        case ".png": {
            outputFiles.add(hash + extLower);
            fs.copyFileSync(fullFilePath, path.join(outputDir, hash) + extLower);
            break;
        }

        case ".heic": {
            try {
                execSync(`heif-convert "${fullFilePath}" "${path.join(outputDir, hash)}.jpeg"`);
            } catch (ex) {
                console.log(`Could not convert ${fullFilePath}, just assume it is jpeg`, ex);
                fs.copyFileSync(fullFilePath, path.join(outputDir, hash) + ".jpeg");
                // process.exit(1);2
            }
            outputFiles.add(hash + ".jpeg");
            break;
        }

        case ".mp4":
        case ".mov": {
            // Convert to gif
            try {
                outputFiles.add(hash + ".gif");
                execSync(`ffmpeg -y -i "${fullFilePath}" -qscale 0 "${path.join(outputDir, hash)}.gif"`);
            } catch (ex) {
                console.log(`Could not convert ${fullFilePath}`, ex);
                process.exit(1);
            }
            break;
        }

        default: {
            console.warn("Unknown extension", extLower);
            process.exit(1);
            break;
        }
    }
}

fs.writeFileSync(
    path.join(outputDir, "files.json"),
    JSON.stringify({
        files: Array.from(outputFiles),
    })
);

// Delete other files created by heif-convert
execSync(`rm ${path.join(outputDir, "*-depth*")} ${path.join(outputDir, "*-urn:*")}`);

console.log(outputFiles.size, "files converted");

// console.log("Output files", Array.from(outputFiles));

// /home/stijn/Pictures/Nieuwjaar 2023-2024/Stijn/v09044g40000cc1ohjbc77u99jk48cj0.MP4
