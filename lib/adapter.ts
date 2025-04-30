import { RecipeSchema, GeminiRecipeResponse } from "@/schema/recipe";
import { getImageFromUnsplash } from "./image-generator";

export const recipeAdapter = async (
  recipes: GeminiRecipeResponse[],
  user: string
) => {
  const recipeList: RecipeSchema[] = await Promise.all(
    recipes.map(async (recipe: GeminiRecipeResponse) => {
      const imageUrl =
        (await getImageFromUnsplash(recipe.title + " food")) ??
        `https://source.unsplash.com/featured/?${encodeURIComponent(
          recipe.title.replace(/\s+/g, "-")
        )}+food`;
      return { ...recipe, imageUrl, isFavorite: false, user };
    })
  );

  return recipeList;
};
