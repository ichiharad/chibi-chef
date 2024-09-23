import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Camera, X } from "lucide-react";

const IngredientForm = ({ newIngredients, setNewIngredients, handleAddIngredients, setIsPhotoMode }) => {
  const handleDeleteIngredient = (index) => {
    const updatedIngredients = newIngredients.filter((_, i) => i !== index);
    setNewIngredients(updatedIngredients);
  };

  return (
    <div className="space-y-4">
      {newIngredients.map((ingredient, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            placeholder="食材名"
            value={ingredient.name}
            onChange={(e) => {
              const updatedIngredients = [...newIngredients];
              updatedIngredients[index].name = e.target.value;
              setNewIngredients(updatedIngredients);
            }}
            className="material-input flex-grow"
          />
          <Input
            type="date"
            value={ingredient.expiryDate}
            onChange={(e) => {
              const updatedIngredients = [...newIngredients];
              updatedIngredients[index].expiryDate = e.target.value;
              setNewIngredients(updatedIngredients);
            }}
            className="material-input w-40"
          />
          <Button
            onClick={() => handleDeleteIngredient(index)}
            variant="destructive"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        onClick={() => setNewIngredients([...newIngredients, { name: "", expiryDate: "" }])}
        className="w-full flex items-center justify-center"
        variant="outline"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> 食材を追加
      </Button>
      <div className="flex space-x-2">
        <Button onClick={handleAddIngredients} className="material-button flex-grow">
          保存
        </Button>
        <Button onClick={() => setIsPhotoMode(true)} className="material-button" variant="outline">
          <Camera className="mr-2 h-4 w-4" />
          写真から追加
        </Button>
      </div>
    </div>
  );
};

export default IngredientForm;
