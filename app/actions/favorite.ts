'use server'

import Favorite from "@/models/Favorite";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/session";
import Recipe from "@/models/Recipe";
import { RecipeSchema, ResponseSchema } from "@/schema/recipe";

export async function updateFavorite(recipeId: string): Promise<{ success: boolean; message: string; isFavorited?: boolean }> {
  try {
    const userSession = await getSession();

    if (!userSession) {
      return {
        success: false,
        message: "Authentication required"
      };
    }

    await connectDB();

    const favorite = await Favorite.findOne({
      userId: userSession.userId,
      recipeId: recipeId
    });

    if (favorite) {
      // If favorite exists, remove it
      await favorite.deleteOne();
      return {
        success: true,
        message: "Recipe removed from favorites",
        isFavorited: false
      };
    } else {
      // If favorite doesn't exist, create it
      const newFavorite = new Favorite({
        userId: userSession.userId,
        recipeId: recipeId
      });

      await newFavorite.save();

      return {
        success: true,
        message: "Recipe added to favorites",
        isFavorited: true
      };
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return {
      success: false,
      message: "Failed to toggle favorite"
    };
  }
}

export async function getFavoriteStatus(recipeId: string): Promise<{ success: boolean; isFavorited: boolean; message?: string }> {
  try {
    const userSession = await getSession();

    if (!userSession) {
      return {
        success: false,
        isFavorited: false,
        message: "Authentication required"
      };
    }

    await connectDB();

    const favorite = await Favorite.findOne({
      userId: userSession.userId,
      recipeId: recipeId
    });

    return {
      success: true,
      isFavorited: !!favorite
    };
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return {
      success: false,
      isFavorited: false,
      message: "Failed to check favorite status"
    };
  }
}

export async function getUserFavorites(): Promise<ResponseSchema> {
  try {
    const userSession = await getSession();

    if (!userSession) {
      return {
        success: false,
        message: "Authentication required"
      };
    }

    await connectDB();

    const favorites = await Favorite.find({
      userId: userSession.userId
    });
    
    const recipes = (await Recipe.find({
      _id: { $in: favorites.map(f => f.recipeId) }
    })).map(recipe => recipe.toJSON());

    return {
      success: true,
      data: recipes as unknown as RecipeSchema[]
    };
  } catch (error) {
    console.error('Error getting user favorites:', error);
    return {
      success: false,
      message: "Failed to get user favorites"
    };
  }
} 