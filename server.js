const cors = require('cors');
app.use(cors());
const express = require('express');
const bodyParser = require('body-parser');
const atob = require('atob'); // To decode base64 strings


const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    // Separate numbers and alphabets from input data
    let numbers = [];
    let alphabets = [];
    data.forEach(item => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else {
            alphabets.push(item);
        }
    });

    // Extract lowercase alphabets and find the highest one
    let lowercaseAlphabets = alphabets.filter(char => char === char.toLowerCase());
    const highestLowercaseAlphabet = lowercaseAlphabets.sort().slice(-1); // last alphabet in sorted order

    // Check if a file was uploaded
    let fileValid = false;
    let fileMimeType = '';
    let fileSizeKB = 0;

    if (file_b64) {
        try {
            let decodedFile = atob(file_b64); // Decode base64 to binary string
            fileValid = true;
            // Mock file details for simplicity
            fileMimeType = "image/png"; // Example MIME type (change if required)
            fileSizeKB = Buffer.byteLength(decodedFile) / 1024; // Calculate file size in KB
        } catch (err) {
            fileValid = false; // Invalid base64 file string
        }
    }

    // Build the response object based on the data
    res.status(200).json({
        is_success: true,
        user_id: "john_doe_17091999",
        email: "john@xyz.com",
        roll_number: "ABCD123",
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        file_valid: fileValid,
        file_mime_type: fileMimeType,
        file_size_kb: fileSizeKB
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
