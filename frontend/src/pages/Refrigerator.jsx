import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, Camera, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchAllIngredients, addIngredient, deleteIngredient, recognizeIngredientsFromImage } from "../utils/api";
import IngredientForm from "../components/IngredientForm";
import IngredientList from "../components/IngredientList";
import { useToast } from "@/components/ui/use-toast";

const Refrigerator = () => {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredients, setNewIngredients] = useState([{ name: "", expiryDate: "" }]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      const response = await fetchAllIngredients();
      setIngredients(response.data);
    } catch (error) {
      console.error("Failed to fetch ingredients:", error);
      toast({
        title: "エラー",
        description: "食材の取得に失敗しました。",
        variant: "destructive",
      });
    }
  };

  const resetDialog = () => {
    setNewIngredients([{ name: "", expiryDate: "" }]);
    setIsDialogOpen(false);
    setIsPhotoMode(false);
  };

  const handleAddIngredients = async () => {
    try {
      for (const ingredient of newIngredients) {
        if (ingredient.name && ingredient.expiryDate) {
          await addIngredient(ingredient);
        }
      }
      resetDialog();
      loadIngredients();
      toast({
        title: "成功",
        description: "新しい食材が追加されました。",
      });
    } catch (error) {
      console.error("Failed to add ingredients:", error);
      toast({
        title: "エラー",
        description: "食材の追加に失敗しました。",
        variant: "destructive",
      });
    }
  };

  const handleDeleteIngredient = async (id) => {
    try {
      await deleteIngredient(id);
      loadIngredients();
      toast({
        title: "成功",
        description: "食材が削除されました。",
      });
    } catch (error) {
      console.error("Failed to delete ingredient:", error);
      toast({
        title: "エラー",
        description: "食材の削除に失敗しました。",
        variant: "destructive",
      });
    }
  };

  const handleImageInput = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        const response = await recognizeIngredientsFromImage(file);
        const recognizedIngredients = response.data.recognizedIngredients.map(name => ({
          name,
          expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default expiry date: 3 days from now
        }));
        setNewIngredients(recognizedIngredients);
        setIsPhotoMode(false);
        toast({
          title: "成功",
          description: "画像から食材を認識しました。",
        });
      } catch (error) {
        console.error("Failed to recognize ingredients:", error);
        toast({
          title: "エラー",
          description: "画像からの食材認識に失敗しました。",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-8">      
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-primary">現在の食材リスト</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="material-button" onClick={() => setIsDialogOpen(true)}>新しい食材を追加</Button>
            </DialogTrigger>
            <DialogContent className="material-card">
              <DialogHeader>
                <DialogTitle>新しい食材を追加</DialogTitle>
                <Button
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                  onClick={resetDialog}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogHeader>
              {isPhotoMode ? (
                <div className="space-y-4">
                  <p>写真から食材を追加します。カメラを起動してください。</p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageInput}
                    className="hidden"
                    id="cameraInput"
                    disabled={isLoading}
                  />
                  <label htmlFor="cameraInput" className={`material-button flex items-center justify-center cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                    {isLoading ? '処理中...' : 'カメラを起動'}
                  </label>
                  <Button onClick={() => setIsPhotoMode(false)} variant="outline" disabled={isLoading}>
                    手動入力に戻る
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[300px] pr-4">
                  <IngredientForm
                    newIngredients={newIngredients}
                    setNewIngredients={setNewIngredients}
                    handleAddIngredients={handleAddIngredients}
                    setIsPhotoMode={setIsPhotoMode}
                  />
                </ScrollArea>
              )}
            </DialogContent>
          </Dialog>
        </div>
        <IngredientList ingredients={ingredients} handleDeleteIngredient={handleDeleteIngredient} />
      </section>
    </div>
  );
};

export default Refrigerator;
