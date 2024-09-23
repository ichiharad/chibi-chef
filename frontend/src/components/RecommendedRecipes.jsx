import { Button } from "@/components/ui/button";
import RecipeGrid from "./RecipeGrid";

const RecommendedRecipes = ({ recipes, onRegenerate }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-primary mb-4">おすすめレシピ</h2>
      <RecipeGrid recipes={recipes} />
      <div className="text-center">
        <Button className="material-button" onClick={onRegenerate}>
          もう一度レシピを考える
        </Button>
      </div>
    </div>
  );
};

export default RecommendedRecipes;
