// Mock function to simulate fetching a recipe from a URL
export const fetchRecipeFromUrl = async (url) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock recipe data
  const mockRecipe = {
    name: "インポートされたレシピ",
    ingredients: "材料1, 材料2, 材料3",
    steps: "手順1\n手順2\n手順3",
    description: "このレシピはURLからインポートされました。"
  };

  // Simulate different responses based on URL
  if (url.includes("error")) {
    throw new Error("Failed to fetch recipe");
  }

  return mockRecipe;
};