// app.js

const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/calculate', async (req, res) => {
  try {
    const { file, product } = req.body;

    if (!file) {
      return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
    }

    // Check if the file exists
    const fileExistsResponse = await axios.get(`http://container2:6002/file-exists/${file}`);

    if (!fileExistsResponse.data.exists) {
      return res.status(404).json({ file, error: 'File not found.' });
    }

    // Send the file and product to Container 2
    const calculationResponse = await axios.post('http://container2:6002/calculate', {
      file,
      product,
    });

    // Return the response from Container 2
    res.json(calculationResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(6000, () => {
  console.log('Container 1 listening on port 6000');
});
