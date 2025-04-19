const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  name: String,
  country: String,
  company: String,
  questions: [String],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Submission', submissionSchema);
