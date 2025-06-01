import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Heart, Trash, Clock, Users, Star, Lock, UnlockIcon } from "lucide-react";
import { useState } from "react";
import { RecipeSchema } from "@/schema/recipe";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TabType } from "@/schema/common";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { updateRecipeVisibility } from "@/app/actions/recipe";
import { toast } from "sonner";
import RecipeModal from "../recipe-modal/RecipeModal";

interface RecipeCardProps {
  recipe: RecipeSchema;
  currentTab: TabType;
  onFavorite: (recipeId: string) => void;
  onUpdate?: (updatedRecipe: RecipeSchema) => void;
  isOwner?: boolean;
  isAuthenticated?: boolean;
}

const RecipeCard = ({ recipe, currentTab, onFavorite, onUpdate, isOwner, isAuthenticated }: RecipeCardProps) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(recipe.isFavorite);
  const [isPublic, setIsPublic] = useState<boolean>(recipe.isPublic);

  const toggleFavorite = (recipeId: string) => {
    setIsFavorite(!isFavorite);
    onFavorite(recipeId);
  };

  const toggleVisibility = async (recipeId: string) => {
    const response = await updateRecipeVisibility(recipeId);
    if (response.success && response.data) {
      setIsPublic(!isPublic);
      if (onUpdate) {
        onUpdate(response.data as RecipeSchema);
      }
      toast.success(response.message);
    } else {
      toast.error(response.message || "Failed to update visibility");
    }
  };

  return (
    <Dialog>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="group overflow-hidden bg-card hover:bg-card/80 transition-all duration-300 h-full shadow-2xl justify-between">
          <div className="relative">
            <AspectRatio ratio={16 / 7} className="rounded-md overflow-hidden flex items-center justify-center mx-auto px-4">
              <img
                src={recipe.imageUrl || "/hero-image2.jpg"}
                alt={recipe.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 rounded-md"
              />
              {/* Left side badges */}
              <div className="absolute top-2 left-4 flex flex-col gap-2">
                <Badge variant="secondary" className="bg-muted">
                  {
                    !recipe.isPublic ? (
                      <>
                        <Lock className="w-3 h-3 mr-1" />
                        Private
                      </>
                    ) : (
                      <>
                        <UnlockIcon className="w-3 h-3 ml-1" />
                        Public
                      </>
                    )
                  }
                </Badge>
              </div>

              {/* Right side badges */}
              <div className="absolute top-2 right-4 flex gap-2">
                {isAuthenticated && (<Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(recipe.id as string)}
                  className="bg-background/80 backdrop-blur-sm hover:bg-background/90 h-8 w-8 rounded-full cursor-pointer"
                >
                  {currentTab === "favorites" ? (
                    <Trash className="h-4 w-4 text-red-500" />
                  ) : (
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        isFavorite ? "fill-red-500 text-red-500" : "text-foreground"
                      }`}
                    />
                  )}
                </Button>)}
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleVisibility(recipe.id as string)}
                    className="bg-background/80 backdrop-blur-sm hover:bg-background/90 h-8 w-8 rounded-full cursor-pointer"
                    title={isPublic ? "Make Private" : "Make Public"}
                  >
                    {isPublic ? (
                      <UnlockIcon className="h-4 w-4 text-primary" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                )}
              </div>
            </AspectRatio>
          </div>

          <CardContent className="p-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
                {recipe.title}
              </h3>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.cookingTime}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {recipe.dietaryTags?.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= (recipe.averageRating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({recipe.reviews?.length || 0 } reviews)
                </span>
              </div>

              <DialogTrigger asChild>
                <Button
                  className="w-full mt-2 cursor-pointer"
                  variant="default"
                >
                  View Recipe
                </Button>
              </DialogTrigger>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <RecipeModal
        recipe={recipe}
        onUpdate={(updatedRecipe) => {
          if (updatedRecipe.isFavorite !== recipe.isFavorite) {
            setIsFavorite(updatedRecipe.isFavorite);
          }
          onUpdate?.(updatedRecipe);
        }}
        isAuthenticated={isAuthenticated}
      />
    </Dialog>
  );
};

export default RecipeCard;
