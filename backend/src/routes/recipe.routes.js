const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const { protect, chefOnly, adminOnly } = require('../middleware/auth.middleware');
const { uploadRecipeImage } = require('../middleware/upload.middleware');

// Public routes
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);

// Protected routes
router.post('/', protect, chefOnly, uploadRecipeImage.single('image'), recipeController.createRecipe);
router.put('/:id', protect, uploadRecipeImage.single('image'), recipeController.updateRecipe);
router.delete('/:id', protect, recipeController.deleteRecipe);

// **NEW** Thumbnail upload route (must be before /:id to avoid conflict)
router.patch(
  '/:id/thumbnail',
  protect,
  uploadRecipeImage.single('image'),
  recipeController.updateRecipeThumbnail
);

// Admin routes
router.get('/admin/all', protect, adminOnly, recipeController.adminGetAllRecipes);

module.exports = router;