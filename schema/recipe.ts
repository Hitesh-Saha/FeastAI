export interface GeminiRecipeResponse {
    title: string;
    ingredients: string[];
    instructions: string[];
    imageUrl: string;
}

export interface RecipeSchema extends GeminiRecipeResponse {
    id?: string;
    timestamp?: string;
    isFavorite: boolean;
    user: string;
}

export type RecipeResponse = {
    data?: RecipeSchema | RecipeSchema[]
    message?: string
    success: boolean
}
