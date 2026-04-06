const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const chromiumBinDir = path.join(
  __dirname,
  "..",
  "node_modules",
  "@sparticuz",
  "chromium",
  "bin"
);

const outputPath = path.join(__dirname, "..", "public", "chromium-pack.tar");

// Only run if @sparticuz/chromium is installed (dev dependency)
if (!fs.existsSync(chromiumBinDir)) {
  console.log("@sparticuz/chromium not found, skipping chromium pack.");
  process.exit(0);
}

// Ensure public directory exists
const publicDir = path.join(__dirname, "..", "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log("Packaging Chromium binary from @sparticuz/chromium...");
execSync(`tar -cf "${outputPath}" -C "${chromiumBinDir}" .`);

const stats = fs.statSync(outputPath);
console.log(
  `Chromium pack created: ${outputPath} (${(stats.size / 1024 / 1024).toFixed(1)}MB)`
);
