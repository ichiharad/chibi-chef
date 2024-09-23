import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RecommendedRecipes from "../components/RecommendedRecipes";
import { fetchAllIngredients, getRecommendedRecipes } from "../utils/api";
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [refrigeratorItems, setRefrigeratorItems] = useState([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadRefrigeratorContents();
  }, []);

  const loadRefrigeratorContents = async () => {
    try {
      const response = await fetchAllIngredients();
      setRefrigeratorItems(response.data);
    } catch (error) {
      console.error("Failed to fetch refrigerator contents:", error);
      toast({
        title: "エラー",
        description: "冷蔵庫の中身の取得に失敗しました。",
        variant: "destructive",
      });
    }
  };

  const loadRecommendedRecipes = async () => {
    try {
      const response = await getRecommendedRecipes();
      setRecommendedRecipes(response.data);
      setShowRecommendations(true);
    } catch (error) {
      console.error("Failed to fetch recommended recipes:", error);
      toast({
        title: "エラー",
        description: "おすすめレシピの取得に失敗しました。",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <section className="material-card p-6">
        <h2 className="text-2xl font-semibold text-primary mb-4">冷蔵庫の中身</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {refrigeratorItems.slice(0, 3).map((item) => (
            <Card key={item.id} className="material-card">
              <CardContent className="p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">消費期限: {item.expiryDate}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Link to="/refrigerator">
          <Button className="material-button">冷蔵庫を確認する</Button>
        </Link>
      </section>
      
      {!showRecommendations && (
        <div className="text-center">
          <Button
            className="material-button text-lg py-3 px-6"
            onClick={loadRecommendedRecipes}
          >
            何が作れるかな？
          </Button>
        </div>
      )}

      {showRecommendations && (
        <RecommendedRecipes recipes={recommendedRecipes} onRegenerate={loadRecommendedRecipes} />
      )}
    </div>
  );
};

export default Home;
