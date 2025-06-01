import { z } from "zod";

const ReviewSchema = z.object({
  userId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.string().datetime()
});

const NutritionSchema = z.object({
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbohydrates: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  fiber: z.number().nonnegative(),
  sugar: z.number().nonnegative(),
  sodium: z.number().nonnegative()
});

const GeminiRecipeSchema = z.object({
  title: z.string().min(1),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  imageUrl: z.string().url(),
  nutrition: NutritionSchema,
  servings: z.number().positive()
});

const BaseRecipeSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  imageUrl: z.string().url(),
  timestamp: z.string().datetime().optional(),
  isFavorite: z.boolean(),
  user: z.string(),
  reviews: z.array(ReviewSchema).optional(),
  averageRating: z.number().min(0).max(5).optional(),
  nutrition: NutritionSchema,
  dietaryTags: z.array(z.string()).optional(),
  suggestedPairings: z.array(z.string()).optional(),
  modifiedFrom: z.string().optional(),
  servings: z.number().positive(),
  cookingTime: z.number().positive().optional(),
  isPublic: z.boolean(),
});

const ResponseModel = z.object({
  data: z.union([BaseRecipeSchema, z.array(BaseRecipeSchema)]).optional(),
  message: z.string().optional(),
  success: z.boolean()
});

const RecipeParamsSchema = z.object({
  recipeId: z.string().min(1)
});

// Type exports
export type Review = z.infer<typeof ReviewSchema>;
export type BaseNutrition = z.infer<typeof NutritionSchema>;
export type GeminiRecipeResponse = z.infer<typeof GeminiRecipeSchema>;
export type RecipeSchema = z.infer<typeof BaseRecipeSchema>;
export type ResponseSchema = z.infer<typeof ResponseModel>;

// Schema exports
export { 
  ReviewSchema,
  NutritionSchema,
  GeminiRecipeSchema,
  BaseRecipeSchema,
  ResponseModel,
  RecipeParamsSchema
};
