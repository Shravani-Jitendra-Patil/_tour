const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/my_databases')
  .then(() => {
    console.log('Connected to MongoDB');

    // Start the server after successful connection
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a schema and model for your user collection
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Route to handle form submission for login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in the database
    const user = await User.findOne({ email, password });

    if (user) {
      // Redirect to the index page after successful login
      res.redirect('/');
    } else {
      // If user does not exist, render the login page again with an error message
      res.sendFile(path.join(__dirname, 'login.html'));
    }
  } catch (error) {
    // Handle errors
    console.error('Error logging in:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to serve the index page
app.get('/', async (req, res) => {
  try {
    // Query all users and send the result to the index page
    const users = await User.find({});
    console.log('All users:', users);
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (error) {
    // Handle errors
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});
