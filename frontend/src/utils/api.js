import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Updated to use HTTPS

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchAllRecipes = () => api.get('/recipes');
export const fetchRecipeById = (id) => api.get(`/recipes/${id}`);
export const createRecipe = (recipeData) => api.post('/recipes', recipeData);
export const updateRecipe = (id, recipeData) => api.put(`/recipes/${id}`, recipeData);
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);
export const importRecipeFromUrl = (url) => api.post('/recipes/import', { url });

export const fetchAllIngredients = () => api.get('/refrigerator');
export const addIngredient = (ingredientData) => api.post('/refrigerator', ingredientData);
export const updateIngredient = (id, ingredientData) => api.put(`/refrigerator/${id}`, ingredientData);
export const deleteIngredient = (id) => api.delete(`/refrigerator/${id}`);
export const recognizeIngredientsFromImage = (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  return api.post('/refrigerator/recognize', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getRecommendedRecipes = () => api.get('/recipes/recommendations');

export default api;
