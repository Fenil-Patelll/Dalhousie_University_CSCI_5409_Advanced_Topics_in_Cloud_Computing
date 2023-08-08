// app.js
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
    const data = req.body;
    console.log('testing api...', data);
    console.log("fenil")
    res.send('hello K8S, Fenil Patel Dal University' );
  });

app.post('/store-file', async (req, res) => {
    try {
        const { file, data } = req.body;
        console.log("hello")
        if (!file || !data) {
            return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
        }

        // Store the file in the persistent storage
        const storageResponse = await axios.post('http://localhost:6002/store-file', {
            file,
            data,
        });

        // Return the response from Container 2
        res.json(storageResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/calculate', async (req, res) => {
    try {
        const { file, product } = req.body;

        if (!file || !product) {
            return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
        }

        // Check if the file exists
        const fileExistsResponse = await axios.get(`http://localhost:6002/file-exists/${file}`);

        if (!fileExistsResponse.data.exists) {
            return res.status(404).json({ file, error: 'File not found.' });
        }

        // Send the file and product to Container 2
        const calculationResponse = await axios.post('http://localhost:6002/calculate', {
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
