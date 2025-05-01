import { motion } from "framer-motion";
import { Card, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Heart, Trash } from "lucide-react";
import { useState } from "react";
import { RecipeSchema } from "@/schema/recipe";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomButton } from "../CustomButton";
import { TabType } from "@/schema/common";
import RecipeDetails from "./RecipeDetails";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface RecipeCardProps {
  recipe: RecipeSchema;
  currentTab: TabType;
  onFavorite: (recipeId: string) => void;
};

const RecipeCard = ({ recipe, currentTab, onFavorite }: RecipeCardProps) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(recipe.isFavorite);

  const toggleFavorite = (recipeId: string) => {
    setIsFavorite(!isFavorite);
    onFavorite(recipeId);
  };

  return (
    <Dialog>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="flex flex-col gap-6 shadow-2xl rounded-4xl border-b-6 border-r-6 border-base-100 relative justify-center items-center h-full">
          <AspectRatio ratio={16 / 7} className="rounded-2xl overflow-hidden w-68 flex items-center justify-center mx-auto">
            <img
              src={recipe.imageUrl || "/hero-image2.jpg"}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          <CardTitle className="text-2xl font-extrabold text-center px-4">
            {recipe.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(recipe.id as string)}
            className="bg-overlay h-8 w-8 rounded-full cursor-pointer absolute top-3 right-3"
          >
            {currentTab === "favorites" ? (
              <Trash className="h-5 w-5 text-red-500" />
            ) : (
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            )}
          </Button>
          <DialogTrigger asChild>
            <CustomButton className="font-bold">view</CustomButton>
          </DialogTrigger>
          <div className="font-semibold text-md text-left px-4">
            Recipe Generated at:{" "}
            {new Date(
              (recipe?.timestamp as string) || Date.now()
            ).toLocaleString()}
          </div>
        </Card>
      </motion.div>
      <RecipeDetails recipe={recipe} />
    </Dialog>
  );
};

export default RecipeCard;
