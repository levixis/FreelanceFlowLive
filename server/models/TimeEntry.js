import mongoose from 'mongoose';

const timeEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    default: null
  },
  description: {
    type: String,
    default: 'No description'
  },
  billable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Convert _id to id for frontend compatibility
timeEntrySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export default mongoose.model('TimeEntry', timeEntrySchema);