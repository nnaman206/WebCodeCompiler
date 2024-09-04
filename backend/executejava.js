const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executejava = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const className = getClassName(data);
        if (!className) {
          reject(new Error("Could not find public class in Java file"));
          return;
        }
        const outputFilePath = path.join(outputPath, className + ".class");
        exec(
          `javac "${filepath}" -d "${outputPath}" && java -cp "${outputPath}" ${className}`,
          (error, stdout, stderr) => {
            if (error) {
              console.error(`Execution error: ${error}`);
              reject({ error: error.message, stderr });
              return; // Stop further execution if there's an error
            }
            if (stderr) {
              console.error(`Execution stderr: ${stderr}`);
              reject(stderr);
              return; // Stop further execution if there's stderr output
            }
            // Remove newline characters and trim the output
            const output = stdout.replace(/\r\n/g, '').trim();
            resolve(output);
          }
        );
      }
    });
  });
};

function getClassName(data) {
  const regex = /public\s+class\s+(\w+)/;
  const match = data.match(regex);
  if (match) {
    return match[1];
  } else {
    // Try to find the first class name
    const regex = /class\s+(\w+)/;
    const match = data.match(regex);
    if (match) {
      return match[1];
    } else {
      return null;
    }
  }
}

module.exports = {
  executejava,
};