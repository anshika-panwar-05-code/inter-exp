const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');
const Submission = require('./models/Submission');

dotenv.config();

const app = express();

// CORS configuration to allow the frontend URL
app.use(cors({
  origin: [
    'http://localhost:3000', // Allow localhost
    'http://192.168.9.68:3000' // Allow network IP address
  ],
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}));


app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB Atlas connection error:", err));

// Auth middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from header
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Register route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error registering user', error: err.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// Protected route
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, you have accessed a protected route!` });
});

// Create submission
app.post('/submissions', authenticate, async (req, res) => {
  const { name, country, company, questions } = req.body;
  try {
    const newSubmission = new Submission({
      name,
      country,
      company,
      questions,
      userId: req.user.id,
    });
    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (err) {
    res.status(400).json({ message: 'Error creating submission', error: err.message });
  }
});

// Get all submissions with optional search by company name
app.get('/submissions', authenticate, async (req, res) => {
  const { company } = req.query;  // Search query for company name

  try {
    let query = {};
    if (company) {
      query.company = new RegExp(company, 'i');  // Use case-insensitive regex for matching
    }

    const submissions = await Submission.find(query).populate('userId', 'email');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving submissions', error: err.message });
  }
});

// Get specific submission
app.get('/submissions/:id', authenticate, async (req, res) => {
  try {
    const submission = await Submission.findOne({ _id: req.params.id, userId: req.user.id });
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving submission', error: err.message });
  }
});

// Edit submission
app.put('/submissions/:id', authenticate, async (req, res) => {
  const { name, country, company, questions } = req.body;
  try {
    const updatedSubmission = await Submission.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, country, company, questions },
      { new: true }
    );
    if (!updatedSubmission) return res.status(404).json({ message: 'Submission not found' });
    res.json(updatedSubmission);
  } catch (err) {
    res.status(500).json({ message: 'Error updating submission', error: err.message });
  }
});

// Delete submission
app.delete('/submissions/:id', authenticate, async (req, res) => {
  try {
    const deletedSubmission = await Submission.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedSubmission) return res.status(404).json({ message: 'Submission not found' });
    res.json({ message: 'Submission deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting submission', error: err.message });
  }
});

// Start the server on the given port
app.listen(PORT, () => {
  console.log(`Server running on http://192.168.9.68:${PORT}`);
});
