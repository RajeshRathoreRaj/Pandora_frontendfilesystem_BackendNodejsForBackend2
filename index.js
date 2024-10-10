
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Folder to store files
const FILE_DIRECTORY = path.join(__dirname, 'files');

// Ensure the directory exists
if (!fs.existsSync(FILE_DIRECTORY)) {
    fs.mkdirSync(FILE_DIRECTORY);
}

// Create a file
app.post('/create-file', (req, res) => {
    const fileName = req.body.fileName;
    const filePath = path.join(FILE_DIRECTORY, fileName);

    if (fs.existsSync(filePath)) {
        return res.status(400).json({ message: 'File already exists' });
    }

    fs.writeFile(filePath, '', (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating file' });
        }
        res.status(200).json({ message: 'File created successfully' });
    });
});

// Delete a file
app.delete('/delete-file', (req, res) => {
    const fileName = req.body.fileName;
    const filePath = path.join(FILE_DIRECTORY, fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ message: 'File does not exist' });
    }

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting file' });
        }
        res.status(200).json({ message: 'File deleted successfully' });
    });
});

// Read a file
app.post('/read-file', (req, res) => {
    const fileName = req.body.fileName;
    const filePath = path.join(FILE_DIRECTORY, fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ message: 'File does not exist' });
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }
        res.status(200).json({ message: 'File content:', content: data });
    });
});

// Write to a file (Overwrite)
app.post('/write-file', (req, res) => {
    const { fileName, content } = req.body;
    const filePath = path.join(FILE_DIRECTORY, fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ message: 'File does not exist' });
    }

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error writing to file' });
        }
        res.status(200).json({ message: 'File content overwritten successfully' });
    });
});

// Append to a file
app.post('/append-file', (req, res) => {
    const { fileName, content } = req.body;
    const filePath = path.join(FILE_DIRECTORY, fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ message: 'File does not exist' });
    }

    fs.appendFile(filePath, content, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error appending to file' });
        }
        res.status(200).json({ message: 'Content appended successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
