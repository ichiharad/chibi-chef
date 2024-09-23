// Recipe APIs
export const recipeApis = {
  getAllRecipes: {
    method: 'GET',
    endpoint: '/api/recipes',
    description: 'Get all recipes',
  },
  getRecipeById: {
    method: 'GET',
    endpoint: '/api/recipes/:id',
    description: 'Get a specific recipe by ID',
  },
  createRecipe: {
    method: 'POST',
    endpoint: '/api/recipes',
    description: 'Create a new recipe',
    requestBody: {
      name: 'string',
      ingredients: 'string',
      steps: 'string',
      description: 'string',
    },
  },
  updateRecipe: {
    method: 'PUT',
    endpoint: '/api/recipes/:id',
    description: 'Update an existing recipe',
    requestBody: {
      name: 'string',
      ingredients: 'string',
      steps: 'string',
      description: 'string',
    },
  },
  deleteRecipe: {
    method: 'DELETE',
    endpoint: '/api/recipes/:id',
    description: 'Delete a recipe',
  },
  importRecipeFromUrl: {
    method: 'POST',
    endpoint: '/api/recipes/import',
    description: 'Import a recipe from a URL',
    requestBody: {
      url: 'string',
    },
  },
};

// Refrigerator APIs
export const refrigeratorApis = {
  getAllIngredients: {
    method: 'GET',
    endpoint: '/api/refrigerator',
    description: 'Get all ingredients in the refrigerator',
  },
  addIngredient: {
    method: 'POST',
    endpoint: '/api/refrigerator',
    description: 'Add a new ingredient to the refrigerator',
    requestBody: {
      name: 'string',
      expiryDate: 'string (YYYY-MM-DD)',
    },
  },
  updateIngredient: {
    method: 'PUT',
    endpoint: '/api/refrigerator/:id',
    description: 'Update an existing ingredient',
    requestBody: {
      name: 'string',
      expiryDate: 'string (YYYY-MM-DD)',
    },
  },
  deleteIngredient: {
    method: 'DELETE',
    endpoint: '/api/refrigerator/:id',
    description: 'Delete an ingredient from the refrigerator',
  },
  recognizeIngredientsFromImage: {
    method: 'POST',
    endpoint: '/api/refrigerator/recognize',
    description: 'Recognize ingredients from an uploaded image',
    requestBody: {
      image: 'file',
    },
  },
};

// Recommendation API
export const recommendationApi = {
  getRecommendedRecipes: {
    method: 'GET',
    endpoint: '/api/recommendations',
    description: 'Get recommended recipes based on refrigerator contents',
  },
};