import { BookOpenIcon, RefrigeratorIcon } from "lucide-react";
import Home from "./pages/Home";
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import Refrigerator from "./pages/Refrigerator";

export const navItems = [
  {
    title: "Home",
    to: "/",
    hidden: true,
    page: <Home />,
  },
  {
    title: "Recipes",
    to: "/recipes",
    icon: <BookOpenIcon className="h-6 w-6" />,
    page: <RecipeList />,
  },
  {
    title: "Refrigerator",
    to: "/refrigerator",
    icon: <RefrigeratorIcon className="h-6 w-6" />,
    page: <Refrigerator />,
  },
  {
    title: "Recipe Detail",
    to: "/recipe/:id",
    page: <RecipeDetail />,
    hidden: true,
  },
];
