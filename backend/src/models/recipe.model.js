const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  ingredients: { type: [String], required: true, validate: [arr => arr.length > 0, 'At least one ingredient required'] },
  steps: { type: [String], required: true, validate: [arr => arr.length > 0, 'At least one step required'] },
  prepTime: { type: Number, required: true, min: 1 },
  cuisine: { type: String, default: 'General' },
  image: { type: String, default: null },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);