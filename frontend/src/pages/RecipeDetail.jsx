import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { fetchRecipeById, deleteRecipe } from "../utils/api";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isKidsChef, setIsKidsChef] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const response = await fetchRecipeById(id);
        setRecipe(response.data);
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
        toast({
          title: "エラー",
          description: "レシピの取得に失敗しました。",
          variant: "destructive",
        });
      }
    };

    loadRecipe();
  }, [id, toast]);

  const handleDeleteRecipe = async () => {
    try {
      await deleteRecipe(id);
      toast({
        title: "成功",
        description: "レシピが削除されました。",
      });
      navigate("/recipes");
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      toast({
        title: "エラー",
        description: "レシピの削除に失敗しました。",
        variant: "destructive",
      });
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const ingredientsList = recipe.ingredients.split(',').map(item => item.trim());
  const stepsList = isKidsChef && recipe.steps_for_child
    ? recipe.steps_for_child.split('\n').filter(step => step.trim() !== '')
    : recipe.steps.split('\n').filter(step => step.trim() !== '');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Link to="/recipes">
          <Button variant="outline">レシピ一覧に戻る</Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">レシピを削除</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>レシピを削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消せません。本当にこのレシピを削除しますか？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteRecipe}>削除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img src={recipe.image || "/preset-recipe-1.jpg"} alt={recipe.name} className="w-full md:w-1/3 h-64 object-cover rounded-lg" />
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-orange-800">{recipe.name}</h1>
              <p className="text-lg text-gray-600">{recipe.description}</p>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isKidsChef}
                  onCheckedChange={setIsKidsChef}
                  id="kids-mode"
                />
                <label htmlFor="kids-mode" className="text-sm font-medium">
                  {isKidsChef ? "キッズシェフモード" : "大人シェフモード"}
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold text-orange-700 mb-4">材料</h2>
          <ul className="list-disc list-inside space-y-2">
            {ingredientsList.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-orange-700 mb-4">
            {isKidsChef ? "キッズシェフ用調理手順" : "調理手順"}
          </h2>
          <ol className="list-decimal list-inside space-y-4">
            {stepsList.map((step, index) => (
              <li key={index} className="pl-2">{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
};

export default RecipeDetail;
