import { RecipeSchema, GeminiRecipeResponse } from "@/schema/recipe";

export const recipeAdapter = (recipes: GeminiRecipeResponse[], user: string) => {
  const recipeList: RecipeSchema[] = [];
  recipes.map((item: GeminiRecipeResponse) => {
    // if (!item.imageUrl || !item.imageUrl.startsWith("http")) {
    //   item.imageUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(
    //     item.title.replace(/\s+/g, "-")
    //   )}`;
    // }
    const newRecipe: RecipeSchema = {
      ...item,
      isFavorite: false,
      user
    };
    recipeList.push(newRecipe);
  });

  return recipeList;
};