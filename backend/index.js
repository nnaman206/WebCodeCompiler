const express = require("express");
const { generateFile } = require("./generatefile");
const { executejava } = require("./executejava");
const { executeCpp } = require("./executecpp");
const Job = require("./models/job");
const mongoose = require("mongoose");
const cors = require('cors');

// Initialize the app and connect to MongoDB
const mongoURI = "mongodb://localhost/complier";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const app = express();

// Middleware to handle CORS and JSON requests
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Endpoint to check job status
app.get("/status", async (req, res) => {
  const jobId = req.query.id;

  if (!jobId) {
    return res.status(400).json({ success: false, error: "Missing job ID" });
  }

  try {
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ success: false, error: "Invalid Job ID" });
    }

    return res.status(200).json({ success: true, job });
  } catch (err) {
    console.error("Error fetching job status:", err);
    return res.status(500).json({ success: false, error: "An error occurred while retrieving the job status." });
  }
});

// Endpoint to run code
app.post("/run", async (req, res) => {
  const { language = "java", code } = req.body; // Default to Java if language is not specified

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }

  let job;
  try {
    // Generate the appropriate file for the given language
    const filePath = await generateFile(language, code);
    job = new Job({
      language,
      filepath: filePath,
      startedAt: new Date(), // Set the start time
      status: "pending"
    });

    // Save the job to the database
    await job.save();
    const jobId = job._id;
    console.log("Job created:", job);
    res.status(201).json({ success: true, jobId });

    let output;
    // Execute the code based on the language specified
    if (language === "java") {
      output = await executejava(filePath);
    } else if (language === "cpp") {
      output = await executeCpp(filePath);
    } else {
      return res.status(400).json({ success: false, error: "Language not supported!" });
    }

    // Update job with output and completion time
    job.output = output;
    job.completedAt = new Date();
    job.status = "success";
    await job.save();
    console.log("Job completed:", job);
  } catch (error) {
    // Handle errors, mark job as failed
    if (job) {
      job.completedAt = new Date();
      job.status = "failed";
      job.output = JSON.stringify(error);
      await job.save();
    }
    console.error("Job execution failed:", error);
    res.status(500).json({ success: false, error: "An error occurred while executing the job." });
  }
});

// Start the server
app.listen(5500, () => {
  console.log("Server is listening on port 5500");
});
