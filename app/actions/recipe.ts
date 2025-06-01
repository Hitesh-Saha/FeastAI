"use server";

import { recipeAdapter } from "@/lib/adapter";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/session";
import Recipe from "@/models/Recipe";
import { GeminiRecipeSchema, ResponseSchema, ResponseModel, RecipeSchema } from "@/schema/recipe";
import { GoogleGenAI, Type } from "@google/genai";
import { Types } from "mongoose";
import { redirect } from "next/navigation";
import { z } from "zod";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

const TIMEOUT_MS = 30000;

const CreateRecipeSchema = z.object({
    ingredients: z.array(z.string()).min(1),
    count: z.number().int().min(1).max(6),
    preference: z.string()
});

export const createRecipe = async (ingredients: string[], count: number, preference: string, isGuest: boolean = false): Promise<ResponseSchema> => {
    if (!isGuest) {
        await connectDB();
        const userSession = await getSession();
        
        if(!userSession) {
            redirect('/login');
        }
    }
    
    try {
        // Validate input parameters
        const validatedInput = CreateRecipeSchema.parse({ ingredients, count, preference });
        
        const prompt = `Create a maximum of ${validatedInput.count} recipes using these ingredients: ${validatedInput.ingredients.join(", ")}. The recipes should have ${validatedInput.preference} diet type preference. Include detailed nutritional information for each recipe. Also, find a relevant image of the final dish from any image website like unsplash. The image should be a valid image either of the same dish or similar dish. Replace {dish-name} with the name of the dish. Be creative but make sure the recipe is practical and delicious. Each recipe should include calories, protein, carbohydrates, fat, fiber, sugar, and sodium content per serving.`
            
        const config = {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        'title': {
                            type: Type.STRING,
                            description: 'Name of the recipe',
                            nullable: false,
                        },
                        'ingredients': {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: 'List of ingredients with measurements',
                            },
                        },
                        'instructions': {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: 'List of step by step cooking instructions',
                            },
                        },                    'imageUrl': {
                            type: Type.STRING,
                            description: 'Image URL of the dish',
                        },
                        'nutrition': {
                            type: Type.OBJECT,
                            properties: {
                                'calories': {
                                    type: Type.NUMBER,
                                    description: 'Calories per serving',
                                },
                                'protein': {
                                    type: Type.NUMBER,
                                    description: 'Protein content in grams per serving',
                                },
                                'carbohydrates': {
                                    type: Type.NUMBER,
                                    description: 'Carbohydrate content in grams per serving',
                                },
                                'fat': {
                                    type: Type.NUMBER,
                                    description: 'Fat content in grams per serving',
                                },
                                'fiber': {
                                    type: Type.NUMBER,
                                    description: 'Fiber content in grams per serving',
                                },
                                'sugar': {
                                    type: Type.NUMBER,
                                    description: 'Sugar content in grams per serving',
                                },
                                'sodium': {
                                    type: Type.NUMBER,
                                    description: 'Sodium content in milligrams per serving',
                                },
                            },
                            required: ['calories', 'protein', 'carbohydrates', 'fat', 'fiber', 'sugar', 'sodium'],
                        },
                        'servings': {
                            type: Type.NUMBER,
                            description: 'Number of servings this recipe makes',
                        },
                    },
                    required: ['title', 'ingredients', 'instructions', 'imageUrl', 'nutrition', 'servings'],
                },
            },
        };

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
            reject(new Error("Request timed out"));
            }, TIMEOUT_MS);
        });

        const result = await Promise.race([
            genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
            config: config
            }),
            timeoutPromise
        ]);

        if (result instanceof Error) {
            throw result;
        };
    
        const response = (result as {text: string})?.text;
        const parsedRecipes = JSON.parse(response);
        
        // Validate the generated recipes against our schema
        const validatedRecipes = z.array(GeminiRecipeSchema).parse(parsedRecipes);

        // For authenticated users, store the recipes
        const userSession = await getSession();
        const recipeList = await recipeAdapter(validatedRecipes, userSession ? userSession!.userId : "", isGuest);
        if (isGuest){
            return ResponseModel.parse({ 
                success: true,
                data: recipeList as unknown as RecipeSchema[]
            });
        }
        const recipes = (await Recipe.insertMany(recipeList)).map(doc => doc.toJSON()) as unknown as RecipeSchema[];

        return ResponseModel.parse({ 
            success: true,
            data: recipes
        });
    } catch (err) {
        console.error("Error generating recipe:", err);
        if ((err as Error).message === "Request timed out") {
            return ResponseModel.parse({
                success: false,
                message: "Recipe generation timed out. Please try again."
            });
        }
        if (err instanceof z.ZodError) {
            return ResponseModel.parse({
                success: false,
                message: "Invalid recipe data generated. Please try again."
            });
        }
        return ResponseModel.parse({
            message: "Failed to generate recipe. Please try again.",
            success: false
        });
    }
}

export const getRecipeHistory = async (): Promise<ResponseSchema> => {
    await connectDB();
    
    const userSession = await getSession();
    
    if(!userSession) {
        redirect('/login');
    }

    try {
        const recipes = (await Recipe.find({ user: userSession.userId}).sort({ timestamp: -1 })).map(doc => doc.toJSON()) as unknown as RecipeSchema[];
        return {
            success: true,
            data: recipes
        }
        
    } catch (error) {
        console.error("Error fetching recipe history:", error);
        return {
            message: "Some error occured while fetching past recipes, Please try again",
            success: false
        };
    }

}

export const getFavoriteRecipes = async (): Promise<ResponseSchema> => {
    await connectDB();
    
    const userSession = await getSession();
    
    if(!userSession) {
        redirect('/login');
    }

    try {
        const recipes = (await Recipe.find({ user: userSession.userId, isFavorite: true }).sort({ timestamp: -1 })).map(doc => doc.toJSON()) as unknown as RecipeSchema[];
        
        return {
            success: true,
            data: recipes
        }
    } catch (error) {
        console.error("Error fetching favorite recipes:", error);
        return {
            message: "Some error occured while fetching past recipes, Please try again",
            success: false
        };
    }

}

export const getFeaturedRecipes = async (): Promise<ResponseSchema> => {
    await connectDB();
    
    try {
        // Get recipes that are either featured or have high ratings (4+ stars)
        const recipes = await Recipe.find({
            $or: [
                { isPublic: true },
                { $and: [           // Top-rated public recipes
                    { averageRating: { $gte: 4 } }
                ]}
            ]
        })
        .sort({ averageRating: -1, 'reviews.length': -1 }) // Sort by rating and reviews
        .limit(10); // Limit to 10 featured recipes
        
        return ResponseModel.parse({
            success: true,
            data: recipes.map(doc => doc.toJSON()) as unknown as RecipeSchema[]
        });
    } catch (error) {
        console.error("Error fetching featured recipes:", error);
        return ResponseModel.parse({
            message: "Failed to fetch featured recipes",
            success: false
        });
    }
}

const UpdateRecipeParamsSchema = z.object({
    recipeId: z.string().min(1)
});

export const updateFavoriteRecipe = async(recipeId: string): Promise<ResponseSchema> => {
    await connectDB();
    
    const userSession = await getSession();
    
    if(!userSession) {
        redirect('/login');
    }

    try {
        // Validate input
        const { recipeId: validatedId } = UpdateRecipeParamsSchema.parse({ recipeId });
        
        const recipe = await Recipe.findOne({ _id: validatedId, user: userSession.userId });

        if (!recipe) {
            return ResponseModel.parse({
                message: "Recipe not found or not owned by user",
                success: false
            });
        }
        
        recipe.isFavorite = !recipe.isFavorite;
        await recipe.save();

        return ResponseModel.parse({
            success: true,
            message: 'Favorite Updated Successfully!',
            data: recipe.toJSON() as unknown as RecipeSchema
        });
    } catch (error) {
        console.error("Error updating favorite recipe:", error);
        if (error instanceof z.ZodError) {
            return ResponseModel.parse({
                message: "Invalid recipe ID provided",
                success: false
            });
        }
        return ResponseModel.parse({
            message: "Failed to update favorite status",
            success: false
        });
    }
}

export const updateRecipeVisibility = async (recipeId: string): Promise<ResponseSchema> => {
    await connectDB();
    
    const userSession = await getSession();
    
    if(!userSession) {
        redirect('/login');
    }

    try {
        // Validate input
        const { recipeId: validatedId } = UpdateRecipeParamsSchema.parse({ recipeId });
        
        const recipe = await Recipe.findOne({ _id: validatedId, user: userSession.userId });

        if (!recipe) {
            return ResponseModel.parse({
                message: "Recipe not found or not owned by user",
                success: false
            });
        }
        
        recipe.isPublic = !recipe.isPublic;
        await recipe.save();

        return ResponseModel.parse({
            success: true,
            message: `Recipe is now ${recipe.isPublic ? 'public' : 'private'}`,
            data: recipe.toJSON() as unknown as RecipeSchema
        });
    } catch (error) {
        console.error("Error updating recipe visibility:", error);
        if (error instanceof z.ZodError) {
            return ResponseModel.parse({
                message: "Invalid recipe ID provided",
                success: false
            });
        }
        return ResponseModel.parse({
            message: "Failed to update recipe visibility",
            success: false
        });
    }
}

const RateRecipeSchema = z.object({
    recipeId: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional()
});

export async function rateRecipe(recipeId: string, formData: FormData): Promise<ResponseSchema> {
    await connectDB();
    
    const session = await getSession();

    if (!session) {
      redirect('/login');
    }

    try {
        const validatedFields = RateRecipeSchema.safeParse({
            recipeId,
            rating: Number(formData.get("rating")),
            comment: formData.get("comment")
        });

        if (!validatedFields.success) {
            return ResponseModel.parse({
                success: false,
                message: "Invalid rating data provided"
            });
        }

        const { rating, comment } = validatedFields.data;

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
          return { success: false, message: "Recipe not found" };
        }

        // Check if user has already rated
        const existingRatingIndex = recipe.reviews.findIndex(
          (review) => review.userId.toString() === session.userId
        );

        if (existingRatingIndex >= 0) {
          recipe.reviews[existingRatingIndex] = {
            userId: new Types.ObjectId(session.userId),
            rating,
            comment,
            createdAt: new Date(),
          };
        } else {
          recipe.reviews.push({
            userId: new Types.ObjectId(session.userId),
            rating,
            comment,
            createdAt: new Date(),
          });
        }

        // Update average rating
        const totalRating = recipe.reviews.reduce((acc, review) => acc + review.rating, 0);
        recipe.averageRating = totalRating / recipe.reviews.length;    
        const updatedRecipe = await recipe.save();
        return { 
          success: true, 
          message: "Rating submitted successfully",
          data: updatedRecipe.toJSON() as unknown as RecipeSchema
        };
    } catch (error) {
        console.error("Error rating recipe:", error);
        return { success: false, message: "Failed to submit rating" };
    }
}

export async function getRecipeWithNutrition(recipeId: string) {
  try {
    const recipe = await Recipe.findById(recipeId).populate("nutrition");
    if (!recipe) {
      return { success: false, message: "Recipe not found" };
    }

    return { success: true, recipe };
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return { success: false, message: "Failed to fetch recipe" };
  }
}

export async function updateRecipeDietary(
  recipeId: string,
  dietaryPreferences: string[]
) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, message: "You must be logged in to modify recipes" };
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return { success: false, message: "Recipe not found" };
    }

    if (recipe.user.toString() !== session.userId) {
      return { success: false, message: "You don't have permission to modify this recipe" };
    }

    recipe.dietaryTags = dietaryPreferences;
    await recipe.save();

    return { success: true, message: "Recipe dietary preferences updated" };
  } catch (error) {
    console.error("Error updating recipe:", error);
    return { success: false, message: "Failed to update recipe" };
  }
}

