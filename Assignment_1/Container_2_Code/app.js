//Working code

const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();

app.use(express.json());

app.get('/file-exists/:file', (req, res) => {
  const { file } = req.params;
  const filePath = `./testfiles/${file}`;

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.json({ exists: false });
    } else {
      res.json({ exists: true });
    }
  });
});

app.post('/calculate', (req, res) => {
  const { file, product } = req.body;
  const filePath = `./testfiles/${file}`;
  let sum = 0;

  const fileStream = fs.createReadStream(filePath);
  fileStream.on('error', (error) => {
    res.json({ file, error: 'Error reading file.' });
  });

  fileStream.pipe(csv())
    .on('data', (row) => {
      if (row.product === product) {
        sum += parseInt(row.amount);
      }
    })
    .on('end', () => {
      if(CSVValidation(filePath)){res.json({ file, sum });}
      else{
        res.json({ file, error: 'Input file not in CSV format.' });
      }
    })
    
    .on('headers', (headers) => {
      // Check if the headers match the expected format
      if (!headers.includes('product') || !headers.includes('amount')) {
        res.json({ file, error: 'Input file not in CSV format.' });
      }
    });
});

// Validation for CSV
function CSVValidation(filePath) {

  const fd = fs.readFileSync(filePath, "utf8");

  const ln = fd.trim().split("\n");

  for (const l of ln) {
    const v = l.trim().split(",");
    if (v.length < 2) {
      return false;
    }
  }
  return true;

}

app.listen(6002, () => {
  console.log('Container 2 listening on port 6002');
});



