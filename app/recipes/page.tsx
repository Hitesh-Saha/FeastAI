"use client";

import { useState, useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, Plus, Sparkles, Trash } from "lucide-react";
import { RecipeSchema } from "@/schema/recipe";
// import { generateRecipe } from "@/app/api/gemini-api/route";
import { motion } from "framer-motion";
import RecipeCard from "@/components/recipe-card/RecipeCard";
import MainSectionLayout from "@/components/main-section/MainSectionLayout";
import { toast } from "sonner";
import { CustomButton } from "@/components/CustomButton";
import { createRecipe, getFavoriteRecipes, getRecipeHistory, updateFavoriteRecipe } from "../actions/recipe";
import { TabType } from "@/schema/common";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeSchema[]>([]);
  const [searchHistory, setSearchHistory] = useState<RecipeSchema[]>([]);
  const [favorites, setFavorites] = useState<RecipeSchema[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [isPending, startTransition] = useTransition();
  const [currentTab, setCurrentTab] = useState<TabType>('recipes');

  // useEffect(() => {
  //   try {
  //     const savedFavorites = localStorage.getItem("favorites");
  //     // const savedHistory = localStorage.getItem("searchHistory");
  //     if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  //     // if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
  //   } catch (error) {
  //     console.error("Error loading saved data:", error);
  //   }
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      if(currentTab === 'history') {
        const response = await getRecipeHistory();
        if(response.success) {
          setSearchHistory(response?.data as RecipeSchema[])
        }
        else {
          toast.error("An error occured while fetching the recipes, please try again.");
        }
      }
      else if(currentTab === 'favorite') {
        const response = await getFavoriteRecipes();
        if(response.success) {
          setFavorites(response?.data as RecipeSchema[])
        }
        else {
          toast.error("An error occured while fetching the favorite recipes, please try again.");
        }
      }
    }
    fetchData();
  },[currentTab]);

  const toggleFavorite = async (id: string) => {
    const response = await updateFavoriteRecipe(id);
    if(response.success) {
      const recipe = response.data as RecipeSchema;
      setFavorites((prev) => {
        return recipe.isFavorite ? [...prev, recipe] : prev.filter((r) => r.id !== id); 
      });
      toast.success(recipe.isFavorite ? "Added to favorites" : "Removed from favorites");
    }
    else {
      toast.error("An error occured while updating the favorites, please try again.");
    }
  };

  const addIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.toLowerCase().trim()]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const generateRecipe = () => {
    startTransition(async () => {
      if (ingredients.length === 0) {
        toast("Please add at least one ingredient");
        return;
      }
      const response = await createRecipe(ingredients);
      if(response.success) {
        setRecipes(response?.data as RecipeSchema[]);
        setIngredients([]);
        toast.success('Recipes generated successfully!');
      }
      else {
        toast.error("An error occured while generating recipes, please try again.");
      }
    });
  };

  return (
    <>
      <MainSectionLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-4xl py-10 flex flex-col gap-12"
        >
          <div className="flex items-center justify-center gap-4">
            <ChefHat size={36} />
            <h1 className="text-3xl font-bold">AI Recipe Generator</h1>
          </div>
          <Card className="bg-overlay w-full rounded-4xl shadow-2xl">
            <CardHeader className="flex flex-col items-center gap-4">
              <div className="flex items-start rounded-tl-[5rem] rounded-tr-[4rem] rounded-bl-[5rem] rounded-br-[9rem] bg-base p-2 w-16 h-16">
                <ChefHat size={38} className="text-base-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-base-foreground">
                What's in your kitchen?
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <form onSubmit={addIngredient} className="flex gap-4">
                <Input
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Enter an ingredient"
                  className="flex-1 rounded-4xl bg-white"
                />
                <CustomButton>
                  <Plus className="h-4 w-4" />Add
                </CustomButton>
              </form>

              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="bg-base-secondary text-base-foreground px-3 pt-1 pb-2 rounded-full flex justify-center items-center gap-2"
                    >
                      <h3 className="text-md">{ingredient}</h3>
                      <button
                        onClick={() => removeIngredient(index)}
                        className="text-base-foreground hover:text-destructive p-0 cursor-pointer"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center items-center">
                <CustomButton
                  onClick={() => !isPending ? generateRecipe() : ''}
                  className="bg-base-secondary h-12 border-none"
                  style={{padding: '5px'}}
                  disabled={isPending || ingredients.length === 0}
                >
                  <span className="bg-base rounded-full py-1 px-4 h-full w-full flex items-center">
                    {isPending ? "Generating Recipe..." : "Generate Recipe"}
                  </span>
                  <span className="pr-2 flex items-center"><Sparkles size={24} /></span>
                </CustomButton>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </MainSectionLayout>

      <motion.div
        className="w-full bg-[#9e6e7c2e] rounded-4xl px-6 py-10 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs defaultValue="recipes" className="mx-auto max-w-6xl" value={currentTab} onValueChange={(value) => setCurrentTab(value as TabType)}>
          <TabsList className="w-full grid grid-cols-3 h-12 shadow-2xl bg-base-secondary">
            <TabsTrigger
              value="recipes"
              className="cursor-pointer text-base-foreground"
            >
              Recipes
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="cursor-pointer text-base-foreground"
            >
              History
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="cursor-pointer text-base-foreground"
            >
              Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes">
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {recipes.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={recipe}
                  currentTab="recipes"
                  onFavorite={toggleFavorite}
                />
              ))}
            </motion.div>
            {recipes.length === 0 && (
              <div className="text-center text-primary py-8 w-full">
                Enter ingredients and generate your first recipe!
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {searchHistory.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={recipe}
                  currentTab="history"
                  onFavorite={toggleFavorite}
                />
              ))}
            </motion.div>
            {searchHistory.length === 0 && (
              <div className="text-center text-primary py-8">
                Your search history will appear here
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {favorites.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={recipe}
                  currentTab="favorite"
                  onFavorite={toggleFavorite}
                />
              ))}
            </motion.div>
            {favorites.length === 0 && (
              <div className="text-center text-primary py-8">
                Your favorite recipes will appear here
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  );
}
