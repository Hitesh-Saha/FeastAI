import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RecipeSchema } from "@/schema/recipe";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReviewTab from "./ReviewTab";
import NutritionalTab from "./NutritionalTab";
import { Clock, Users, Star, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DetailsTab from "./DetailsTab";
import { recipeModalTabs } from "@/lib/constant";
import { toast } from "sonner";

interface RecipeModalProps {
  recipe: RecipeSchema;
  onUpdate?: (updatedRecipe: RecipeSchema) => void;
  isAuthenticated?: boolean;
}

const RecipeModal = ({ recipe, onUpdate, isAuthenticated }: RecipeModalProps) => {
  const handleShare = async () => {
    if (!recipe.id) {
      toast.error("Cannot share recipe at this time");
      return;
    }

    const shareUrl = `${window.location.origin}/recipes/${recipe.id}`;
    const shareData = {
      title: recipe.title,
      text: `Check out this recipe for ${recipe.title}!`,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Recipe link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to share recipe");
    }
  };

  return (
    <DialogContent className="w-full h-full lg:min-w-4xl max-h-[90vh] overflow-y-auto lg:overflow-x-hidden bg-card p-0">
      <div className="relative w-full h-[300px] flex-shrink-0">
        <img
          src={recipe.imageUrl || "/hero-image2.jpg"}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-background/20" />
      </div>

      <div className="p-6 -mt-20 relative space-y-6 flex-1">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-3xl font-bold text-card-foreground">
              {recipe.title}
            </DialogTitle>
            <Button
              variant="secondary"
              size="icon"
              className="shrink-0"
              onClick={handleShare}
              title="Share recipe"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-card-foreground">
            <div className="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-1.5">
              <Clock className="h-5 w-5" />
              <span>{recipe.cookingTime} mins</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-1.5">
              <Users className="h-5 w-5" />
              <span>{recipe.servings} servings</span>
            </div>
            {(recipe.averageRating || 0) > 0 && (
              <div className="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-1.5">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span>
                  {recipe.averageRating?.toFixed(1)} ({recipe.reviews?.length || 0} reviews)
                </span>
              </div>
            )}
          </div>

          {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {recipe.dietaryTags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </DialogHeader>

        <Tabs defaultValue="recipe" className="w-full">
          <TabsList className="w-full justify-start h-12 bg-transparent p-0 mb-2 top-0 z-10 border-b">
            {
              recipeModalTabs.map((tab, index) => (
                <TabsTrigger
                  key={index}
                  value={tab.value}
                  className="border-b-2 border-transparent data-[state=active]:border-primary px-4 data-[state=active]:text-base-foreground cursor-pointer"
                >
                  {tab.label}
                </TabsTrigger>
              ))
            }
          </TabsList>

          <div className="relative mt-6">
            <TabsContent value="recipe" className="focus-visible:outline-none">
              <DetailsTab
                recipe={recipe}
              />
            </TabsContent>

            <TabsContent value="nutrition" className="focus-visible:outline-none">
              <NutritionalTab
                recipeId={recipe.id!}
                initialNutrition={recipe.nutrition}
                initialDietaryTags={recipe.dietaryTags}
                servings={recipe.servings || 4}
              />
            </TabsContent>

            <TabsContent value="review" className="focus-visible:outline-none">
              <ReviewTab
                recipeId={recipe.id!}
                currentRating={recipe.reviews?.find(r => r.userId === recipe.user)?.rating}
                averageRating={recipe.averageRating || 0}
                totalReviews={recipe.reviews?.length || 0}
                reviews={recipe.reviews}
                recipe={recipe}
                onUpdate={onUpdate}
                isAuthenticated={isAuthenticated}
              />
            </TabsContent>
          </div>
        </Tabs>

        <div className="mt-6 pt-6 border-t text-sm text-card-foreground/60">
          Generated on {new Date(recipe.timestamp as string).toLocaleDateString()}
        </div>
      </div>
    </DialogContent>
  );
};

export default RecipeModal;