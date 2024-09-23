import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const IngredientList = ({ ingredients, handleDeleteIngredient }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ingredients.map((ingredient) => (
        <Card key={ingredient.id} className="material-card">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{ingredient.name}</h3>
                <p className="text-sm text-gray-600">消費期限: {ingredient.expiryDate}</p>
              </div>
              <Button variant="destructive" onClick={() => handleDeleteIngredient(ingredient.id)} className="material-button bg-red-500">
                削除
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IngredientList;