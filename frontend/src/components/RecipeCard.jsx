import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRandomPresetImage } from "../utils/imageUtils";

const RecipeCard = ({ recipe }) => {
  const imageUrl = recipe.image || getRandomPresetImage();

  return (
    <Card className="material-card flex flex-col h-full">
      <CardContent className="p-0 flex-grow">
        <img src={imageUrl} alt={recipe.name} className="w-full h-48 object-cover rounded-t-lg" />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{recipe.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-3">{recipe.description}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 mt-auto">
        <Link to={`/recipe/${recipe.id}`} className="w-full">
          <Button className="material-button w-full">レシピを見る</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
