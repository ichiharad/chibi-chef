import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecipeGrid from "../components/RecipeGrid";
import { fetchAllRecipes, createRecipe, importRecipeFromUrl } from "../utils/api";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({ name: "", ingredients: "", steps: "", description: "", steps_for_child: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [importUrl, setImportUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const response = await fetchAllRecipes();
      setRecipes(response.data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      toast({
        title: "エラー",
        description: "レシピの取得に失敗しました。",
        variant: "destructive",
      });
    }
  };

  const handleAddRecipe = async () => {
    try {
      await createRecipe(newRecipe);
      setNewRecipe({ name: "", ingredients: "", steps: "", description: "", steps_for_child: "" });
      loadRecipes();
      setIsDialogOpen(false);
      toast({
        title: "成功",
        description: "新しいレシピが追加されました。",
      });
    } catch (error) {
      console.error("Failed to add recipe:", error);
      toast({
        title: "エラー",
        description: "レシピの追加に失敗しました。",
        variant: "destructive",
      });
    }
  };

  const handleImportRecipe = async () => {
    setIsLoading(true);
    try {
      const response = await importRecipeFromUrl(importUrl);
      setNewRecipe(response.data);
      setImportUrl("");
      setIsDialogOpen(false);
      toast({
        title: "成功",
        description: "レシピがインポートされました。",
      });
      loadRecipes();
    } catch (error) {
      console.error("Failed to import recipe:", error);
      toast({
        title: "エラー",
        description: "レシピのインポートに失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Input
          placeholder="レシピを検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="material-input max-w-xs"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="material-button" onClick={() => setIsDialogOpen(true)}>新しいレシピを追加</Button>
          </DialogTrigger>
          <DialogContent className="material-card">
            <DialogHeader>
              <DialogTitle>新しいレシピを追加</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">手動で追加</TabsTrigger>
                <TabsTrigger value="url">URLから追加</TabsTrigger>
              </TabsList>
              <TabsContent value="manual">
                <div className="space-y-4">
                  <Input
                    placeholder="レシピ名"
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                    className="material-input"
                  />
                  <Textarea
                    placeholder="材料（カンマ区切り）"
                    value={newRecipe.ingredients}
                    onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                    className="material-input"
                  />
                  <Textarea
                    placeholder="手順（1行に1つ）"
                    value={newRecipe.steps}
                    onChange={(e) => setNewRecipe({ ...newRecipe, steps: e.target.value })}
                    className="material-input"
                  />
                  <Textarea
                    placeholder="子供向け手順（1行に1つ）"
                    value={newRecipe.steps_for_child}
                    onChange={(e) => setNewRecipe({ ...newRecipe, steps_for_child: e.target.value })}
                    className="material-input"
                  />
                  <Textarea
                    placeholder="レシピの説明"
                    value={newRecipe.description}
                    onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                    className="material-input"
                  />
                  <Button onClick={handleAddRecipe} className="material-button">おいしいレシピを追加</Button>
                </div>
              </TabsContent>
              <TabsContent value="url">
                <div className="space-y-4">
                  <Input
                    placeholder="レシピのURL"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    className="material-input"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleImportRecipe}
                    className="material-button flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        インポート中...
                      </>
                    ) : (
                      'URLからインポート'
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      
      <RecipeGrid recipes={filteredRecipes} />
    </div>
  );
};

export default RecipeList;
