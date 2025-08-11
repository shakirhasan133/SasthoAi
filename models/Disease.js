import mongoose from 'mongoose';

const DiseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  symptoms: {
    type: [String],
    required: true,
  },
  treatments: {
    type: [String],
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Disease || mongoose.model('Disease', DiseaseSchema);
