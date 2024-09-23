import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getRandomPresetImage } from "../utils/imageUtils";

const RecipeGrid = ({ recipes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <Card key={recipe.id} className="material-card flex flex-col h-full">
          <CardContent className="p-4 flex-grow">
            <img 
              src={recipe.image || getRandomPresetImage()} 
              alt={recipe.name} 
              className="w-full h-48 object-cover rounded-t-lg mx-auto"
            />
            <h3 className="text-lg font-semibold mt-2">{recipe.name}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-3">{recipe.description}</p>
          </CardContent>
          <CardFooter className="p-4 mt-auto">
            <Link to={`/recipe/${recipe.id}`} className="w-full">
              <Button className="material-button w-full">レシピを見る</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RecipeGrid;
