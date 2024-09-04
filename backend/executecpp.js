const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
  return new Promise((resolve, reject) => {
    const outputFilePath = path.join(outputPath, "output");
    exec(
      `g++ "${filepath}" -o "${outputFilePath}" && "${outputFilePath}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Execution error: ${error.message}`);
          reject({ error: error.message, stderr });
          return;
        }
        if (stderr) {
          console.error(`Execution stderr: ${stderr}`);
          reject(stderr);
          return;
        }
        const output = stdout.replace(/\r\n/g, '').trim();
        resolve(output);
      }
    );
  });
};

module.exports = {
  executeCpp,
};
