const recipeService = require('../services/recipe.service');
const { NODE_ENV } = require('../config/config');

const handleError = (res, error) => {
  console.error('Recipe Controller Error:', error.message);
  const status = error.statusCode || 500;
  res.status(status).json({ success: false, message: error.message, ...(NODE_ENV === 'development' && { stack: error.stack }) });
};

const createRecipe = async (req, res) => {
  try {
    const result = await recipeService.createRecipe(req.body, req.user.id, req.file);
    res.status(201).json(result);
  } catch (error) { handleError(res, error); }
};

const getAllRecipes = async (req, res) => {
  try {
    const options = { page: req.query.page, limit: req.query.limit, cuisine: req.query.cuisine, keyword: req.query.keyword, chefId: req.query.chefId };
    const result = await recipeService.getAllRecipes(options);
    res.status(200).json(result);
  } catch (error) { handleError(res, error); }
};

const getRecipeById = async (req, res) => {
  try {
    const result = await recipeService.getRecipeById(req.params.id);
    res.status(200).json(result);
  } catch (error) { handleError(res, error); }
};

const updateRecipe = async (req, res) => {
  try {
    const result = await recipeService.updateRecipe(req.params.id, req.body, req.user.id, req.user.role, req.file);
    res.status(200).json(result);
  } catch (error) { handleError(res, error); }
};

const deleteRecipe = async (req, res) => {
  try {
    const result = await recipeService.deleteRecipe(req.params.id, req.user.id, req.user.role);
    res.status(200).json(result);
  } catch (error) { handleError(res, error); }
};

const adminGetAllRecipes = async (req, res) => {
  try {
    const options = { page: req.query.page, limit: req.query.limit, includeNonPublic: req.query.includeNonPublic === 'true' };
    const result = await recipeService.adminGetAllRecipes(options);
    res.status(200).json(result);
  } catch (error) { handleError(res, error); }
};

// NEW: Update only the recipe thumbnail/image
const updateRecipeThumbnail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }
    const result = await recipeService.updateRecipeThumbnail(id, req.file, req.user.id, req.user.role);
    res.status(200).json(result);
  } catch (error) { handleError(res, error); }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  adminGetAllRecipes,
  updateRecipeThumbnail   // <-- export the new function
};