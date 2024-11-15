// zipFiles.js
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

// Define the build and zip directories
const buildDir = path.resolve(__dirname, "dist");
const zipDir = path.resolve(__dirname, "zip");

// Create the zip directory if it doesn't exist
if (!fs.existsSync(zipDir)) {
  fs.mkdirSync(zipDir);
}

// Check if the build directory exists
if (fs.existsSync(buildDir)) {
  // Read all files in the build directory
  fs.readdirSync(buildDir).forEach((file) => {
    const filePath = path.join(buildDir, file);

    // Only zip files (skip directories)
    if (fs.lstatSync(filePath).isFile()) {
      const zip = new AdmZip();
      zip.addLocalFile(filePath);

      // Define the output path in the zip directory
      const zipPath = path.join(zipDir, `${path.parse(file).name}.zip`);
      zip.writeZip(zipPath);

      console.log(
        `Zipped: ${file} -> ${path.join("zip", path.parse(file).name + ".zip")}`
      );
    }
  });
} else {
  console.log("Build directory does not exist.");
}
