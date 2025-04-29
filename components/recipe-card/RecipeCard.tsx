import { motion } from "framer-motion";
import { Card, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";
import { RecipeSchema } from "@/schema/recipe";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { CustomButton } from "../CustomButton";
import { TabType } from "@/schema/common";

type RecipeCardProps = {
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
        <Card className="flex flex-col gap-6 shadow-2xl rounded-4xl border-b-6 border-r-6 border-base-100 relative justify-center items-center">
          <div className="aspect-video rounded-3xl overflow-hidden w-68 flex items-center justify-center mx-auto">
            <img
              src={recipe.imageUrl || "/hero-image2.jpg"}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-2xl font-extrabold text-center px-4">
            {recipe.title}
          </CardTitle>
          {currentTab !== 'favorite' && <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(recipe.id as string)}
            className="bg-overlay h-8 w-8 rounded-full cursor-pointer absolute top-3 right-3"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>}
          <DialogTrigger asChild>
            <CustomButton className="font-bold">
                view
            </CustomButton>
          </DialogTrigger>
          <div className="font-semibold text-md text-left px-4">
            Recipe Generated at: {new Date(recipe?.timestamp as string || Date.now()).toLocaleString()}
          </div>
        </Card>
      </motion.div>

      <DialogContent className="bg-base-secondary min-w-5xl">
        <DialogHeader className="flex flex-col gap-6">
          <DialogTitle className="text-2xl font-bold text-center border-b-2 pb-2 border-base-100">
            {recipe.title}
          </DialogTitle>
          <DialogDescription className="aspect-video rounded-3xl overflow-hidden w-80 flex items-center justify-center mx-auto">
            <img
              src={"/hero-image2.jpg"}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-5 mt-4">
          <div className="flex flex-col gap-4 w-1/3">
            <h3 className="text-xl font-bold uppercase">Ingredients:</h3>
            <ScrollArea className="h-[300px]">
              <ul className="list-disc pl-5 flex flex-col gap-2 text-lg">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </ScrollArea>
          </div>
          <Separator orientation="vertical" className="bg-base-100"/>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold uppercase">Instructions:</h3>
            <ScrollArea className="h-[300px]">
              <ol className="list-decimal pl-5 flex flex-col gap-2 text-lg">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </ScrollArea>
          </div>
        </div>
        <div>
          <span className="uppercase font-bold">Recipe Generated at:</span>
          {new Date(recipe?.timestamp as string || Date.now()).toLocaleString()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeCard;
