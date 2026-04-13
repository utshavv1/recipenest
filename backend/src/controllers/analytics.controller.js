const User = require('../models/user.model');
const Recipe = require('../models/recipe.model');

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalChefs = await User.countDocuments({ role: 'chef', isActive: true });
    const totalRecipes = await Recipe.countDocuments({ isPublic: true });
    const mostPopular = await Recipe.findOne({ isPublic: true }).sort({ enrolledStudents: -1 }).select('title');
    res.json({
      success: true,
      data: {
        totalRecipes,
        totalChefs,
        totalUsers,
        mostPopularRecipe: mostPopular ? mostPopular.title : 'None'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAnalytics };