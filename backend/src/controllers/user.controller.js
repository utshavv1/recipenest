const userService = require('../services/user.service');
const User = require('../models/user.model');   // <-- ADD THIS
const { NODE_ENV } = require('../config/config');

const validateRegister = (data) => {
  const errors = [];
  if (!data.name || data.name.trim() === '') errors.push('Name is required');
  if (!data.email || data.email.trim() === '') errors.push('Email is required');
  else if (!data.email.includes('@')) errors.push('Valid email required');
  if (!data.password || data.password === '') errors.push('Password is required');
  else if (data.password.length < 6) errors.push('Password must be at least 6 characters');
  return errors;
};

const validateLogin = (data) => {
  const errors = [];
  if (!data.email || data.email.trim() === '') errors.push('Email is required');
  if (!data.password || data.password === '') errors.push('Password is required');
  return errors;
};

const validateUpdateProfile = (data) => {
  if (!data) return ['Request body missing'];
  const allowed = ['name', 'bio', 'phone', 'address'];
  const invalid = Object.keys(data).filter(k => !allowed.includes(k));
  return invalid.length ? [`Cannot update: ${invalid.join(', ')}`] : [];
};

const validateChangePassword = (data) => {
  const errors = [];
  if (!data.currentPassword) errors.push('Current password required');
  if (!data.newPassword) errors.push('New password required');
  else if (data.newPassword.length < 6) errors.push('New password must be at least 6 characters');
  return errors;
};

const handleError = (res, error) => {
  console.error('Controller Error:', error.message);
  const status = error.statusCode || 500;
  res.status(status).json({ success: false, message: error.message, ...(NODE_ENV === 'development' && { stack: error.stack }) });
};


const register = async (req, res) => {
  try {
    const errors = validateRegister(req.body);
    if (errors.length) return res.status(400).json({ success: false, message: 'Validation failed', errors });
    const result = await userService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) { handleError(res, error); }
};

const login = async (req, res) => {
  try {
    const errors = validateLogin(req.body);
    if (errors.length) return res.status(400).json({ success: false, message: 'Validation failed', errors });
    const result = await userService.loginUser(req.body.email, req.body.password);
    res.status(200).json(result);
  } catch (error) { handleError(res, error); }
};

const getProfile = async (req, res) => {
  try {
    const result = await userService.getUserProfile(req.user.id);
    res.status(200).json(result);
  } catch (error) { handleError(res, error); }
};

const updateProfile = async (req, res) => {
  try {
    const errors = validateUpdateProfile(req.body);
    if (errors.length) return res.status(400).json({ success: false, message: 'Validation failed', errors });
    const result = await userService.updateUserProfile(req.user.id, req.body, req.file);
    res.status(200).json(result);
  } catch (error) { handleError(res, error); }
};

const changePassword = async (req, res) => {
  try {
    const errors = validateChangePassword(req.body);
    if (errors.length) return res.status(400).json({ success: false, message: 'Validation failed', errors });
    const result = await userService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    res.status(200).json(result);
  } catch (error) { handleError(res, error); }
};

const getAllUsers = async (req, res) => {
  try {
    const options = { page: req.query.page, limit: req.query.limit, includeInactive: req.query.includeInactive === 'true' };
    const result = await userService.getAllUsers(options);
    res.status(200).json(result);
  } catch (error) { handleError(res, error); }
};

const deactivateUser = async (req, res) => {
  try {
    const result = await userService.deactivateUser(req.params.id);
    res.status(200).json(result);
  } catch (error) { handleError(res, error); }
};

const logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out' });
};


// Get all active chefs (public)
const getAllChefs = async (req, res) => {
  try {
    const chefs = await User.find({ role: 'chef', isActive: true }).select('-password');
    res.status(200).json({ success: true, data: chefs });
  } catch (error) {
    handleError(res, error);
  }
};

// Get a single user by ID (public – for chef profile)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    handleError(res, error);
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const result = await userService.updateAvatar(req.user.id, req.file);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};
// ========== EXPORT ==========
module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  updateAvatar,
  changePassword,
  getAllUsers,
  deactivateUser,
  logout,
  getAllChefs,    
  getUserById,    
};