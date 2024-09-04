# WebCodeCompiler
This project is an Online Code Compiler built with a React.js frontend and an Express.js backend, leveraging MongoDB for job management. The compiler supports Java and C++ programming languages, allowing users to write, submit, and execute code directly in their browser.

Backend Overview:
Code Execution:

The backend handles code execution by compiling and running Java and C++ programs.
The code is saved to files dynamically generated on the server, and jobs are created and tracked in MongoDB.
Job Management:

Each code submission creates a job with a unique ID, which tracks the status (pending, success, or failed) and the output of the code execution.
The server provides endpoints to submit code, check job status, and retrieve execution results.
Error Handling:

The backend includes robust error handling, ensuring that any issues during code execution are captured, logged, and communicated back to the user.

Frontend Overview:
User Interface:

The frontend allows users to select their preferred programming language (Java or C++), input code, and submit it for compilation and execution.
The interface is styled for a clean and user-friendly experience, with responsive design for various screen sizes.
Job Submission and Status Monitoring:

Upon submitting code, the frontend communicates with the backend to create a job and periodically checks the job's status.
Users are informed of the job's status, ID, and the output or any errors encountered during execution.
Language and Code Management:

The default programming language can be set and stored in the browser's localStorage.
The code editor dynamically adjusts based on the selected language.
Key Features:
Real-time Feedback: Users receive real-time updates on the status of their code execution.
Robust Error Handling: Both frontend and backend are equipped to handle and display errors gracefully.
Clean and Responsive Design: The user interface is designed to be intuitive and accessible across different devices.
This project effectively integrates the frontend and backend to provide a seamless and efficient online code compilation experience for Java and C++ languages.
