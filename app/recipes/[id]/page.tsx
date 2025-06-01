"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RecipeSchema } from "@/schema/recipe";
import { getRecipeById } from "@/app/actions/recipe";
import { Dialog } from "@/components/ui/dialog";
import RecipeModal from "@/components/recipe-modal/RecipeModal";
import { getIsAuthenticated } from "@/app/actions/auth";
import RecipesPage from "../page";
import { toast } from "sonner";

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeSchema | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      if (params.id) {
        const response = await getRecipeById(params.id as string);
        if (response.success && response.data) {
          setRecipe(response.data as RecipeSchema);
          // Show welcome toast for shared recipes
          toast.info(
            "Welcome! You're viewing this recipe as a guest. Feel free to explore and create your own recipes!",
            {
              duration: 6000,
            }
          );
        }
        setIsLoading(false);
      }
    };

    const getOwnerStatus = async () => {
      const { isAuthenticated: isAuth } = await getIsAuthenticated();
      setIsAuthenticated(isAuth);
    };

    loadRecipe();
    getOwnerStatus();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
          <p className="text-muted-foreground">The recipe you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/recipes')}
            className="mt-6 text-primary hover:underline"
          >
            Browse other recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <RecipesPage />
      <Dialog open={showModal} onOpenChange={(open) => {
        setShowModal(open);
        if (!open) {
          router.push('/recipes');
        }
      }}>
        <RecipeModal
          recipe={recipe}
          onUpdate={(updatedRecipe) => setRecipe(updatedRecipe)}
          isAuthenticated={isAuthenticated}
        />
      </Dialog>
    </>
  );
} 