const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  victimCount: {
    type: Number,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  weaponUsed: {
    type: Boolean,
    required: true,
  },
  motorcycleUsed: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Personalizar JSON
reportSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;