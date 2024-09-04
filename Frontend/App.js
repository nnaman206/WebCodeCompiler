import React, { useEffect, useState } from 'react';
import axios from 'axios';
import stubs from './default';
import "./App.css";
import moment from 'moment';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');
  const [jobId, setJobId] = useState('');
  const [jobDetail, setJobDetails] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  
  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "java";
    setLanguage(defaultLang); 
  }, []);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  useEffect(() => {
    console.log('Component has mounted, perform setup here');
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };  // Cleanup function to clear interval
  }, [intervalId]);
  
  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language);
    console.log(`${language} set as default language`);
  }

  const renderTimeDetail = () => {
    if (!jobDetail) {
      return "";
    }
    let result = '';
    let { submittedAt, completedAt, startedAt } = jobDetail;
    submittedAt = moment(submittedAt).toString();
    result += `Submitted At: ${submittedAt}`;

    if (!completedAt || !startedAt) {
      return result;
    }

    const start = moment(startedAt);
    const end = moment(completedAt);
    const executionTime = end.diff(start, 'seconds', true);
    result += `, Execution Time: ${executionTime} seconds`;
    return result;
  }

  const handleSubmit = async () => {
    const payLoad = {
      language,
      code,
    };

    try {
      setJobId('');
      setStatus('');
      setOutput('');
      setJobDetails(null);

      const { data } = await axios.post("http://localhost:5500/run", payLoad);

      setJobId(data.jobId);
      setStatus('Job submitted, checking status...');

      const id = setInterval(async () => {
        try {
          console.log(`Checking status for job ID: ${data.jobId}`);
          const { data: dataRes } = await axios.get('http://localhost:5500/status', {
            params: { id: data.jobId },
          });
          console.log('Status response:', dataRes);

          const { success, job, error } = dataRes;

          if (success) {
            const { status: jobStatus, output: jobOutput } = job;

            setStatus(jobStatus);
            setJobDetails(job);

            if (jobStatus === 'pending') return;

            setOutput(jobOutput || 'No output returned');
            clearInterval(intervalId);
            setIntervalId(null);
          } else {
            setStatus("Error: Please try again later");
            console.error('Job error:', error);
            setOutput(error || 'An error occurred while processing the job.');
            clearInterval(intervalId);
            setIntervalId(null);
          }
        } catch (intervalError) {
          console.error('Error fetching job status:', intervalError);
          setStatus('Error: Unable to fetch job status.');
          setOutput('Error: Unable to fetch job status.');
          clearInterval(intervalId);
          setIntervalId(null);
        }
      }, 1000);

      setIntervalId(id); // Store interval ID in the state

    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error('Server responded with an error:', err.response.data);
        setStatus(`Error: ${err.response.data.error || 'Server error occurred'}`);
        setOutput(err.response.data.error || 'An error occurred while executing the code.');
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setStatus('Error: No response received from the server.');
        setOutput('Error: No response received from the server.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error in setting up request:', err.message);
        setStatus(`Error: ${err.message}`);
        setOutput(`Error: ${err.message}`);
      }
    }
    
  };

  return (
    <div className="App container">
      <h1 className="title">Online Code Compiler</h1>
      <div className="language-select">
        <label>Language: </label>
        <select
          value={language}
          onChange={(e) => {
            const response = window.confirm("Do you want to proceed further?");
            if (response) {
              setLanguage(e.target.value);
            }
          }}
        >
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      <br/>
      <div className="button-container">
        <button className="btn btn-primary" onClick={setDefaultLanguage}>Set Default</button>
      </div>
      <br />
      <textarea
        rows="20"
        cols="75"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="code-input"
      ></textarea>
      <br />
      <button className="btn btn-success" onClick={handleSubmit}>Submit</button>
      <p className="status">{status}</p>
      <p className="job-id">{jobId && `Job ID: ${jobId}`}</p>
      <p className="time-detail"> {renderTimeDetail()} </p>
      <p className="output">{output}</p>
    </div>
  );
}

export default App;
