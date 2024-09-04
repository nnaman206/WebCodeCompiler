const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

// Only support Java and C++ formats
const validFormats = ["java", "cpp"];

const generateFile = async (format, content) => {
  if (!validFormats.includes(format)) {
    throw new Error(`Invalid file format: ${format}. Supported formats are ${validFormats.join(", ")}.`);
  }

  try {
    const jobId = uuid();
    const filename = `${jobId}.${format}`;
    const filePath = path.join(dirCodes, filename);
    await fs.promises.writeFile(filePath, content);
    return filePath;
  } catch (error) {
    console.error(`Failed to generate file: ${error.message}`);
    throw error;
  }
};

module.exports = {
  generateFile,
};
