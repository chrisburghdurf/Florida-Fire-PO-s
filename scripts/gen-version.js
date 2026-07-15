const fs = require("fs");
const path = require("path");

const version = new Date().toISOString();

const srcDir = path.join(__dirname, "..", "src");
fs.mkdirSync(srcDir, { recursive: true });
fs.writeFileSync(
  path.join(srcDir, "buildVersion.ts"),
  `export const BUILD_VERSION = ${JSON.stringify(version)};\n`
);

const publicDir = path.join(__dirname, "..", "public");
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "version.json"), JSON.stringify({ version }) + "\n");

console.log(`Generated build version: ${version}`);
