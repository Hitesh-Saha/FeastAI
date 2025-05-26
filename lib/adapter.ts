import { RecipeSchema, GeminiRecipeResponse, GeminiRecipeSchema } from "@/schema/recipe";
import { getImageFromUnsplash } from "./image-generator";
import { z } from "zod";

export const recipeAdapter = async (
  recipes: GeminiRecipeResponse[],
  user: string
) => {
  // Validate input recipes
  const validatedRecipes = z.array(GeminiRecipeSchema).safeParse(recipes);
  if (!validatedRecipes.success) {
    throw new Error(`Invalid recipe data: ${validatedRecipes.error.message}`);
  }

  const recipeList = await Promise.all(
    validatedRecipes.data.map(async (recipe) => {
      const imageUrl =
        (await getImageFromUnsplash(recipe.title + " food")) ??
        `https://source.unsplash.com/featured/?${encodeURIComponent(
          recipe.title.replace(/\s+/g, "-")
        )}+food`;

      // Create and validate transformed recipe
      const transformedRecipe = {
        ...recipe,
        imageUrl,
        isFavorite: false,
        user,
        reviews: [],
        averageRating: 0,
        nutrition: recipe.nutrition || {
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
        },
        dietaryTags: [],
        suggestedPairings: [],
        servings: recipe.servings || 4,
        cookingTime: 30,
        isPublic: true,
      };

      const validatedRecipe = RecipeSchema.safeParse(transformedRecipe);
      if (!validatedRecipe.success) {
        throw new Error(`Failed to transform recipe ${recipe.title}: ${validatedRecipe.error.message}`);
      }

      return validatedRecipe.data;
    })
  );

  return recipeList;
};
