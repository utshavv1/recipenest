const User = require('../models/user.model');
const { deleteOldFile, getFileUrl } = require('../config/multer.config');

const registerUser = async (userData) => {
  const { name, email, password, role } = userData;
  // Case‑insensitive email
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const err = new Error('User already exists');
    err.statusCode = 400;
    throw err;
  }
  const user = new User({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'chef'
  });
  await user.save();
  const token = user.generateToken();
  return { success: true, message: 'User registered successfully', data: { user, token } };
};

const loginUser = async (email, password) => {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }
  if (!user.isActive) {
    const err = new Error('Account deactivated');
    err.statusCode = 401;
    throw err;
  }
  const token = user.generateToken();
  return { success: true, message: 'Login successful', data: { user, token } };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return { success: true, data: { user } };
};

const updateUserProfile = async (userId, updateData, avatarFile) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  if (avatarFile) {
    if (user.avatar) deleteOldFile(user.avatar, 'avatars');
    updateData.avatar = getFileUrl(avatarFile.filename, 'avatars');
  }
  const allowed = ['name', 'bio', 'phone', 'address', 'avatar'];
  const filtered = {};
  Object.keys(updateData).forEach(k => {
    if (allowed.includes(k)) filtered[k] = updateData[k];
  });
  Object.assign(user, filtered);
  await user.save();
  return { success: true, message: 'Profile updated', data: { user } };
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    const err = new Error('Current password incorrect');
    err.statusCode = 401;
    throw err;
  }
  user.password = newPassword;
  await user.save();
  return { success: true, message: 'Password changed' };
};

const getAllUsers = async (options = {}) => {
  const { page = 1, limit = 10, includeInactive = false } = options;
  const query = includeInactive ? {} : { isActive: true };
  const skip = (page - 1) * limit;
  const users = await User.find(query).limit(limit).skip(skip).sort({ createdAt: -1 });
  const total = await User.countDocuments(query);
  return { success: true, data: { users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } };
};

const deactivateUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  user.isActive = false;
  await user.save();
  return { success: true, message: 'User deactivated' };
};
const updateAvatar = async (userId, file) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  // Delete old avatar if exists
  if (user.avatar) {
    deleteOldFile(user.avatar, 'avatars');
  }
  const avatarUrl = getFileUrl(file.filename, 'avatars');
  user.avatar = avatarUrl;
  await user.save();
  return {
    success: true,
    message: 'Avatar updated successfully',
    data: { user, avatarUrl }
  };
};

module.exports = {
  registerUser,
  updateAvatar,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  deactivateUser
};