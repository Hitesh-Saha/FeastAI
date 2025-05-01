"use server";

import { recipeAdapter } from "@/lib/adapter";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/session";
import Recipe from "@/models/Recipe";
import { RecipeResponse, RecipeSchema } from "@/schema/recipe";
import { GoogleGenAI, Type } from "@google/genai";
import { redirect } from "next/navigation";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

const TIMEOUT_MS = 30000;

export const createRecipe = async (ingredients: string[], count: number, preference: string): Promise<RecipeResponse> => {
    await connectDB();
    
    const userSession = await getSession();
    
    if(!userSession) {
        redirect('/login');
    }
    
    try {
        const prompt = `Create a maximum of ${count} recipes using these ingredients: ${ingredients.join(", ")}. The recipes should have ${preference} diet type preference. Also, find a relevant image of the final dish from any image website like unsplash. The image should be a valid image either of the same dish or similar dish. Replace {dish-name} with the name of the dish. Be creative but make sure the recipe is practical and delicious.`
            
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
                    },
                    'imageUrl': {
                        type: Type.STRING,
                        description: 'Image URL of the dish',
                    },
                },
                required: ['title', 'ingredients', 'instructions', 'imageUrl'],
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
    
        const response = (result as any)?.text;
        const recipeList = await recipeAdapter(JSON.parse(response), userSession.userId);

        const recipes = (await Recipe.insertMany(recipeList)).map(doc => doc.toJSON()) as unknown as RecipeSchema[];

        return { 
            success: true,
            data: recipes
        }
    } catch (err) {
        console.error("Error generating recipe:", err);
        if ((err as Error).message === "Request timed out") {
            return {
                success: false,
                message: "Recipe generation timed out. Please try again."
            }
        }
        return {
            message: "Failed to generate recipe. Please try again.",
            success: false
        };
    }
}

export const getRecipeHistory = async (): Promise<RecipeResponse> => {
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
        return {
            message: "Some error occured while fetching past recipes, Please try again",
            success: false
        };
    }

}

export const getFavoriteRecipes = async (): Promise<RecipeResponse> => {
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
        return {
            message: "Some error occured while fetching past recipes, Please try again",
            success: false
        };
    }

}

export const updateFavoriteRecipe = async(recipeId: string): Promise<RecipeResponse> => {
    await connectDB();
    
    const userSession = await getSession();
    
    if(!userSession) {
        redirect('/login');
    }

    try {
        const recipe = await Recipe.findOne({ _id: recipeId, user: userSession.userId });

        if (!recipe) {
            return {
                message: "Recipe not found or not owned by user",
                success: false
            };
        }
        
        recipe.isFavorite = !recipe.isFavorite;
        await recipe.save();

        return {
            success: true,
            message: 'Favorite Updated Successfully!',
            data: recipe.toJSON() as unknown as RecipeSchema
        }
        
    } catch (error) {
        return {
            message: "Some error occured while fetching past recipes, Please try again",
            success: false
        };
    }
}

