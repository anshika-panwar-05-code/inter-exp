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
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Check for required env variables
if (!JWT_SECRET || !MONGO_URI) {
  throw new Error("Missing environment variables. Ensure JWT_SECRET and MONGO_URI are set.");
}

// ✅ CORS for Local + Render Frontend
const cors = require('cors');
app.use(cors({
  origin: 'https://inter-exp-fronted.onrender.com', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ✅ Auth Routes
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error registering user', error: err.message });
  }
});

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

// ✅ Protected Route Test
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, you have accessed a protected route!` });
});

// ✅ Submission Routes
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

app.get('/submissions', authenticate, async (req, res) => {
  const { company } = req.query;
  try {
    const query = company ? { company: new RegExp(company, 'i') } : {};
    const submissions = await Submission.find(query).populate('userId', 'email');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving submissions', error: err.message });
  }
});

app.get('/submissions/:id', authenticate, async (req, res) => {
  try {
    const submission = await Submission.findOne({ _id: req.params.id, userId: req.user.id });
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving submission', error: err.message });
  }
});

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

app.delete('/submissions/:id', authenticate, async (req, res) => {
  try {
    const deletedSubmission = await Submission.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedSubmission) return res.status(404).json({ message: 'Submission not found' });
    res.json({ message: 'Submission deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting submission', error: err.message });
  }
});

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
