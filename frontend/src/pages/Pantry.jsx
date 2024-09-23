import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Pantry = () => {
  const [pantryItems, setPantryItems] = useState([
    { id: 1, name: "小麦粉", quantity: 1000, unit: "g" },
    { id: 2, name: "砂糖", quantity: 500, unit: "g" },
    { id: 3, name: "塩", quantity: 250, unit: "g" },
  ]);

  const [newItem, setNewItem] = useState({ name: "", quantity: "", unit: "" });

  const handleAddItem = () => {
    const newId = pantryItems.length + 1;
    setPantryItems([...pantryItems, { id: newId, ...newItem }]);
    setNewItem({ name: "", quantity: "", unit: "" });
  };

  const handleDeleteItem = (id) => {
    setPantryItems(pantryItems.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8">
      <Link to="/">
        <Button variant="outline">ホームに戻る</Button>
      </Link>
      
      <h1 className="text-4xl font-bold text-orange-800">パントリーの在庫</h1>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-orange-700">現在の在庫リスト</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pantryItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.quantity} {item.unit}</p>
                <Button variant="destructive" onClick={() => handleDeleteItem(item.id)} className="mt-2">削除</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button>新しいアイテムを追加</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新しいアイテムを追加</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="アイテム名"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="数量"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            />
            <Input
              placeholder="単位（例：g, ml, 個）"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            />
            <Button onClick={handleAddItem}>追加</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pantry;