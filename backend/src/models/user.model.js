const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/] },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['chef', 'admin'], default: 'chef' },
  avatar: { type: String, default: null },
  bio: { type: String, maxlength: 500, default: '' },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

UserSchema.pre('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateToken = function() {
  return jwt.sign({ id: this._id, email: this.email, role: this.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', UserSchema);