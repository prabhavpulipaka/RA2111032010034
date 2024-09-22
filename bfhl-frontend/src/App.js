import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');  // State to hold the JSON input from the user
  const [response, setResponse] = useState(null);  // State to hold the API response
  const [error, setError] = useState('');          // State to hold error messages
  const [selectedOptions, setSelectedOptions] = useState([]); // Dropdown options selected by the user

  // Function to handle the form submission
  const handleSubmit = async () => {
    setError(''); // Reset error before making the request
    setResponse(null); // Reset response before making the request

    try {
      // Parse the input JSON string
      const parsedInput = JSON.parse(jsonInput);

      // Make a POST request to the backend API
      const res = await axios.post('http://localhost:3000/bfhl', parsedInput);
      setResponse(res.data); // Store the response in the state
    } catch (err) {
      setError('Invalid JSON or server error. Please try again.');
      console.error(err);
    }
  };

  // Function to handle file upload and convert it to base64
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1]; // Extract base64 from result
      const parsedInput = jsonInput ? JSON.parse(jsonInput) : { data: [] };
      parsedInput.file_b64 = base64String; // Add the file base64 string to the JSON input
      setJsonInput(JSON.stringify(parsedInput, null, 2)); // Update JSON input state
    };

    if (file) {
      reader.readAsDataURL(file); // Read the file and convert to base64
    }
  };

  // Function to handle dropdown selection changes
  const handleDropdownChange = (e) => {
    const options = [...e.target.selectedOptions].map(option => option.value);
    setSelectedOptions(options);
  };

  // Function to render filtered response based on user selections
  const renderResponse = () => {
    if (!response) return null; // Return nothing if there's no response yet

    let dataToRender = {};
    if (selectedOptions.includes("Alphabets")) dataToRender.alphabets = response.alphabets;
    if (selectedOptions.includes("Numbers")) dataToRender.numbers = response.numbers;
    if (selectedOptions.includes("Highest Lowercase Alphabet")) dataToRender.highest_lowercase_alphabet = response.highest_lowercase_alphabet;

    return (
      <div>
        <h3>Filtered Response Data</h3>
        <pre>{JSON.stringify(dataToRender, null, 2)}</pre> {/* Pretty-print the filtered JSON */}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>BFHL Challenge Frontend</h1>

      {/* Textarea to enter the JSON input */}
      <textarea
        rows="10"
        cols="50"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON (e.g. { "data": ["A","1","z"] })'
      />
      <br />

      {/* File upload input */}
      <label>Upload File (Optional):</label>
      <input type="file" onChange={handleFileUpload} />
      <br />

      {/* Submit button */}
      <button onClick={handleSubmit}>Submit</button>

      {/* Display error message if there's an error */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Dropdown to select which parts of the response to display */}
      <div>
        <h3>Select Options to Display:</h3>
        <select multiple onChange={handleDropdownChange}>
          <option value="Alphabets">Alphabets</option>
          <option value="Numbers">Numbers</option>
          <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
        </select>
      </div>

      {/* Render the filtered response */}
      {renderResponse()}
    </div>
  );
}

export default App;
