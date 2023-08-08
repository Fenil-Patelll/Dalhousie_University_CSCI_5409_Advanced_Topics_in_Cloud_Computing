// app.js

const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();

app.use(express.json());

app.get('/file-exists/:file', (req, res) => {
    const { file } = req.params;
    const filePath = `/Fenil_PV_dir/${file}`; // Replace 'xxxx' with your first name

    console.log("hello")
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.json({ exists: false });
        } else {
            res.json({ exists: true });
        }
    });
});

app.post('/store-file', (req, res) => {
    const { file, data } = req.body;
    const filePath = `/Fenil_PV_dir/${file}`; // Replace 'xxxx' with your first name

    fs.writeFile(filePath, data, (err) => {
        if (err) {
            res.json({ file, error: 'Error while storing the file to the storage.' });
        } else {
            res.json({ file, message: 'Success.' });
        }
    });
});

app.post('/calculate', (req, res) => {
    const { file, product } = req.body;
    const filePath = `/Fenil_PV_dir/${file}`; // Replace 'xxxx' with your first name
    let sum = 0;

    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (error) => {
        res.json({ file, error: 'Error reading file.' });
    });

    fileStream.pipe(csv())
        .on('data', (row) => {

            for (let prop in row) {
                if (row.hasOwnProperty(prop)) {
                    const trimmedProp = prop.trim(); // Remove leading/trailing spaces from property name
                    const value = row[prop].trim(); // Remove leading/trailing spaces from property value

                    // Assign the trimmed property name and value back to the row object
                    delete row[prop];
                    row[trimmedProp] = value;
                }
            }
            if (row.product === product) {

                sum += parseInt(row.amount);
            }
        })
        .on('end', () => {
            if(CSVValidation(filePath)){res.json({ file, sum: sum.toString() });}
            else{
                res.json({ file, error: 'Input file not in CSV format.' });
            }
        })

        .on('headers', (headers) => {
            // Check if the headers match the expected format
            const result = headers.map(element => {
                return element.trim();
            });

            if (!result.includes('product') || !result.includes('amount')) {
                res.json({ file, error: 'Input file not in CSV format.' });
            }
        });
});

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
