const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: [String],
  gpsLocation: { type: String },
  attempts: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: "open", enum: ["open", "under review", "resolved"] },
}, { timestamps: true });
QuestionSchema.index({ title: 'text', description: 'text' });
module.exports = mongoose.model('Question', QuestionSchema);
