const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIRS = {
  avatars: path.join(__dirname, '../uploads/avatars'),
  recipes: path.join(__dirname, '../uploads/recipes')
};

Object.values(UPLOAD_DIRS).forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const createStorage = (uploadDir) => multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const cleanName = path.parse(file.originalname).name
      .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${cleanName}-${unique}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files (jpg, png, gif, webp) are allowed'), false);
};

const createMulterConfig = (uploadDir, maxSize = 5 * 1024 * 1024) => multer({
  storage: createStorage(uploadDir),
  fileFilter,
  limits: { fileSize: maxSize, files: 1 }
});

const uploadAvatar = createMulterConfig(UPLOAD_DIRS.avatars);
const uploadRecipeImage = createMulterConfig(UPLOAD_DIRS.recipes);

const deleteOldFile = (filePath, type) => {
  if (!filePath) return;
  let fullPath = filePath;
  if (filePath.startsWith('/uploads/')) {
    const parts = filePath.split('/');
    const folder = parts[2];
    const filename = parts[3];
    fullPath = path.join(UPLOAD_DIRS[folder], filename);
  }
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

const getFileUrl = (filename, type) => filename ? `/uploads/${type}/${filename}` : null;

module.exports = { uploadAvatar, uploadRecipeImage, deleteOldFile, getFileUrl, UPLOAD_DIRS };