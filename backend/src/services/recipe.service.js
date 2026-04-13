const Recipe = require('../models/recipe.model');
const { deleteOldFile, getFileUrl } = require('../config/multer.config');

const createRecipe = async (recipeData, chefId, imageFile) => {
  const { title, description, ingredients, steps, prepTime, cuisine } = recipeData;
  const ingredientsArray = Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(i => i.trim());
  const stepsArray = Array.isArray(steps) ? steps : steps.split('\n').filter(s => s.trim() !== '');
  const newRecipe = new Recipe({ title, description, ingredients: ingredientsArray, steps: stepsArray, prepTime, price, cuisine, chef: chefId });
  if (imageFile) newRecipe.image = getFileUrl(imageFile.filename, 'recipes');
  await newRecipe.save();
  return { success: true, message: 'Recipe created', data: { recipe: newRecipe } };
};

const getAllRecipes = async (options = {}) => {
  const { page = 1, limit = 10, cuisine, keyword, chefId } = options;
  const query = { isPublic: true };
  if (cuisine) query.cuisine = cuisine;
  if (chefId) query.chef = chefId;
  if (keyword) query.$or = [
    { title: { $regex: keyword, $options: 'i' } },
    { description: { $regex: keyword, $options: 'i' } },
    { cuisine: { $regex: keyword, $options: 'i' } }
  ];
  const skip = (page - 1) * limit;
  const recipes = await Recipe.find(query).populate('chef', 'name avatar bio').limit(limit).skip(skip).sort({ createdAt: -1 });
  const total = await Recipe.countDocuments(query);
  return { success: true, data: { recipes, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } };
};

const getRecipeById = async (recipeId) => {
  const recipe = await Recipe.findById(recipeId).populate('chef', 'name avatar bio');
  if (!recipe) { const err = new Error('Recipe not found'); err.statusCode = 404; throw err; }
  return { success: true, data: { recipe } };
};

const updateRecipe = async (recipeId, updateData, userId, userRole, imageFile) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) { const err = new Error('Recipe not found'); err.statusCode = 404; throw err; }
  if (userRole !== 'admin' && recipe.chef.toString() !== userId.toString()) {
    const err = new Error('Unauthorized'); err.statusCode = 403; throw err;
  }
  if (imageFile) {
    if (recipe.image) deleteOldFile(recipe.image, 'recipes');
    updateData.image = getFileUrl(imageFile.filename, 'recipes');
  }
  const allowed = ['title', 'description', 'ingredients', 'steps', 'prepTime', 'cuisine', 'isPublic'];
  const filtered = {};
  Object.keys(updateData).forEach(k => {
    if (allowed.includes(k)) {
      if (k === 'ingredients' && typeof updateData[k] === 'string') filtered[k] = updateData[k].split(',').map(i => i.trim());
      else if (k === 'steps' && typeof updateData[k] === 'string') filtered[k] = updateData[k].split('\n').filter(s => s.trim() !== '');
      else filtered[k] = updateData[k];
    }
  });
  Object.assign(recipe, filtered);
  await recipe.save();
  return { success: true, message: 'Recipe updated', data: { recipe } };
};

const deleteRecipe = async (recipeId, userId, userRole) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) { const err = new Error('Recipe not found'); err.statusCode = 404; throw err; }
  if (userRole !== 'admin' && recipe.chef.toString() !== userId.toString()) {
    const err = new Error('Unauthorized'); err.statusCode = 403; throw err;
  }
  recipe.isPublic = false;
  await recipe.save();
  return { success: true, message: 'Recipe deleted (soft delete)' };
};

const adminGetAllRecipes = async (options = {}) => {
  const { page = 1, limit = 10, includeNonPublic = false } = options;
  const query = includeNonPublic ? {} : { isPublic: true };
  const skip = (page - 1) * limit;
  const recipes = await Recipe.find(query).populate('chef', 'name email').limit(limit).skip(skip).sort({ createdAt: -1 });
  const total = await Recipe.countDocuments(query);
  return { success: true, data: { recipes, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } };
};

// NEW: Update only the recipe thumbnail (separate endpoint)
const updateRecipeThumbnail = async (recipeId, file, userId, userRole) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    const err = new Error('Recipe not found');
    err.statusCode = 404;
    throw err;
  }
  if (userRole !== 'admin' && recipe.chef.toString() !== userId.toString()) {
    const err = new Error('Unauthorized to update this recipe');
    err.statusCode = 403;
    throw err;
  }
  // Delete old image if exists
  if (recipe.image) {
    deleteOldFile(recipe.image, 'recipes');
  }
  // Set new image URL
  const imageUrl = getFileUrl(file.filename, 'recipes');
  recipe.image = imageUrl;
  await recipe.save();
  return {
    success: true,
    message: 'Recipe thumbnail updated successfully',
    data: { recipe, imageUrl }
  };
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