const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  contentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  contentType: { type: String, enum: ["question", "answer"], required: true },
  reason: { type: String, required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: "pending", enum: ["pending", "reviewed"] },
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
