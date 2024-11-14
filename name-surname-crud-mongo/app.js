const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MongoDB connection URL (local)
const mongoURI = 'mongodb://localhost:27017/nameSurnameDB';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Mongoose Schema for Name and Surname
const nameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true }
});

// Create a model for the schema
const Name = mongoose.model('Name', nameSchema);

// API Routes

// Get all names and surnames
app.get('/api/names', (req, res) => {
    Name.find()
        .then(names => res.json(names))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new name and surname
app.post('/api/names', (req, res) => {
    const { name, surname } = req.body;

    if (!name || !surname) {
        return res.status(400).json({ error: 'Name and surname are required' });
    }

    const newName = new Name({ name, surname });

    newName.save()
        .then(() => res.json('Name and surname added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Update a name and surname by ID
app.put('/api/names/:id', (req, res) => {
    const { name, surname } = req.body;
    const { id } = req.params;

    Name.findByIdAndUpdate(id, { name, surname }, { new: true })
        .then(updatedName => res.json(updatedName))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Delete a name and surname by ID
app.delete('/api/names/:id', (req, res) => {
    const { id } = req.params;

    Name.findByIdAndDelete(id)
        .then(() => res.json('Name and surname deleted!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Serve static files (frontend)
app.use(express.static('public'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
