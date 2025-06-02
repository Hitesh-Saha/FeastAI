"use client";

import { useState, useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, Plus, Sparkles, Trash } from "lucide-react";
import { RecipeSchema } from "@/schema/recipe";
import { motion } from "framer-motion";
import MainSectionLayout from "@/components/main-section/MainSectionLayout";
import { toast } from "sonner";
import { CustomButton } from "@/components/CustomButton";
import {
  createRecipe,
  getRecipeHistory,
  getFeaturedRecipes,
} from "../actions/recipe";
import { getUserFavorites } from "../actions/favorite";
import { DietaryPreference, TabType } from "@/schema/common";
import RecipeTab from "@/components/recipe-tabs/RecipeTab";
import { dietaryConflictMap, ignoredIngredients, preferenceList, tabOptions } from "@/lib/constant";
import LoadingCard from "@/components/LoadingCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"
import { getIsAuthenticated } from "../actions/auth";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeSchema[]>([]);
  const [searchHistory, setSearchHistory] = useState<RecipeSchema[]>([]);
  const [favorites, setFavorites] = useState<RecipeSchema[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<RecipeSchema[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [isPending, startTransition] = useTransition();
  const [currentTab, setCurrentTab] = useState<TabType>("recipes");
  const [recipeCount, setRecipeCount] = useState<number>(3);
  const [selectedPreference, setSelectedPreference] = useState<string>("");
  const [availablePreferences, setAvailablePreferences] = useState<DietaryPreference[]>(preferenceList);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const getOwnerStatus = async () => {
      const { session, isAuthenticated: isAuth } = await getIsAuthenticated();
      if(isAuth && session) {
        setUserId(session?.userId);
        setIsAuthenticated(isAuth);
      }
      else {
        setIsAuthenticated(isAuth);
        setUserId('');
      }
    };
    getOwnerStatus();
  }, []);

  // Filter tabs based on authentication status
  const availableTabs = tabOptions.filter(tab => {
    if (!isAuthenticated) {
      return tab.value === 'recipes' || tab.value === 'featured';
    }
    return true;
  });

  useEffect(() => {
    const getTabData = async () => {
      try {
        if (!isAuthenticated && (currentTab === 'history' || currentTab === 'favorites')) {
          setCurrentTab('recipes');
          return;
        }
        if (currentTab === "history") {
          const response = await getRecipeHistory();
          if (response.success) {
            setSearchHistory(response.data as RecipeSchema[]);
          } else {
            toast.error("Failed to fetch recipe history");
          }
        } else if (currentTab === "favorites") {
          const response = await getUserFavorites();
          if (response.success) {
            setFavorites(response.data as RecipeSchema[]);
          } else {
            toast.error("Failed to fetch favorite recipes");
          }
        } else if (currentTab === "featured") {
          const response = await getFeaturedRecipes();
          if (response.success) {
            setFeaturedRecipes(response.data as RecipeSchema[]);
          } else {
            toast.error("Failed to fetch featured recipes");
          }
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        toast.error("An error occurred while fetching recipes");
      }
    };
    getTabData();
  }, [currentTab, isAuthenticated]);

  useEffect(() => {
    if (ingredients.length > 0) {
      const conflicts = new Set<string>();

      ingredients.forEach((ingredient) => {
        dietaryConflictMap[ingredient]?.forEach((diet) => conflicts.add(diet));
      });

      const filteredPreferences = preferenceList.filter(
        (opt) => !conflicts.has(opt.value)
      );
      setAvailablePreferences(filteredPreferences);
      
      if (!filteredPreferences.find((opt) => opt.value === selectedPreference)) {
        setSelectedPreference("all");
      }
    } else {
      setAvailablePreferences(preferenceList);
    }
  }, [ingredients]);

  const toggleFavorite = async () => {
    try {
      if (currentTab === "favorites") {
        const favoritesResponse = await getUserFavorites();
        if (favoritesResponse.success && favoritesResponse.data) {
          setFavorites(favoritesResponse.data as RecipeSchema[]);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("An error occurred while updating favorite status");
    }
  };

  const addIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    const inEdible = ignoredIngredients.includes(newIngredient.toLowerCase().trim())
    if (newIngredient.trim() && !ingredients.includes(newIngredient.toLowerCase().trim()) && !inEdible) {
      setIngredients([...ingredients, newIngredient.toLowerCase().trim()]);
      setNewIngredient("");
    }
    else if (inEdible) {
      setNewIngredient("");
      toast.error("This ingredient is not allowed.");
    }
    else {
      toast.error("Please enter a valid ingredient.");
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
      const response = await createRecipe(ingredients, recipeCount, selectedPreference || "all", !isAuthenticated);
      if (response.success) {
        setRecipes(response?.data as RecipeSchema[]);
        setIngredients([]);
        setRecipeCount(3);
        setSelectedPreference("");
        toast.success("Recipes generated successfully!");
      } else {
        toast.error(
          "An error occurred while generating recipes, please try again."
        );
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
            <h1 className="text-3xl font-bold text-center">AI Recipe Generator</h1>
          </div>
          <Card className="bg-overlay w-full rounded-4xl shadow-2xl">
            <CardHeader className="flex flex-col items-center gap-4">
              <div className="flex items-start rounded-tl-[5rem] rounded-tr-[4rem] rounded-bl-[5rem] rounded-br-[9rem] bg-base p-2 w-16 h-16">
                <img src={'/Logo.svg'} className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl font-bold text-base-foreground text-center">
                What&apos;s in your kitchen?
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <form onSubmit={addIngredient} className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Enter an ingredient..."
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  className="flex-1 rounded-4xl bg-white"
                />
                <CustomButton>
                  <Plus className="h-4 w-4" />
                  Add
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

              <div className="flex justify-center items-center flex-wrap gap-4">
                <div className="flex flex-row gap-2 items-center">
                  <Label htmlFor="responseCount" className="text-base-foreground">Number of Recipes:</Label>
                  <Input type="number" min={2} max={6} className="rounded-lg w-16 text-base-foreground font-bold" value={recipeCount} onChange={(e) => setRecipeCount(parseInt(e.target.value))}/>
                </div>
                <Select onValueChange={(value) => setSelectedPreference(value)} value={selectedPreference}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select a preference"  />
                    </SelectTrigger>
                  <SelectContent className="cursor-pointer">
                      <SelectGroup>
                      <SelectLabel>Dietary Preferences</SelectLabel>
                      {
                        availablePreferences.map((preference, index) => (
                          <SelectItem key={index} value={preference.value}>
                            {preference.label}
                          </SelectItem>
                        ))
                      }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                <CustomButton
                  onClick={() => (!isPending ? generateRecipe() : "")}
                  className="bg-base-secondary h-12 border-none"
                  style={{ padding: "5px" }}
                  disabled={isPending || ingredients.length === 0}
                >
                  <span className="bg-base rounded-full py-1 px-4 h-full w-full flex items-center">
                    {isPending ? "Generating Recipe..." : "Generate Recipe"}
                  </span>
                  <span className="pr-2 flex items-center">
                    <Sparkles size={24} />
                  </span>
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
        <Tabs
          defaultValue="recipes"
          className="mx-auto max-w-6xl"
          value={currentTab}
          onValueChange={(value) => setCurrentTab(value as TabType)}
        >
          <TabsList className={`w-full grid ${availableTabs.length >= 4 ? 'grid-cols-4' : 'grid-cols-2'} h-12 shadow-2xl bg-base-secondary`}>
            {availableTabs.map((tab, index) => {
              const { icon: Icon, label, value } = tab;
              return (
                <TabsTrigger
                  value={value}
                  key={index}
                  className="cursor-pointer text-base-foreground flex items-center justify-center gap-1"
                >
                  <Icon />
                  <span className="hidden lg:flex">{label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>            
          <RecipeTab
            tabData={recipes}
            tabValue="recipes"
            toggleFavorite={toggleFavorite}
            onUpdateRecipe={(updatedRecipe) => {
              setRecipes(prev => prev.map(recipe => 
                recipe.id === updatedRecipe.id ? updatedRecipe : recipe
              ));
            }}
            userId={userId}
            isAuthenticated={isAuthenticated}
          />
          <RecipeTab
            tabData={featuredRecipes}
            tabValue="featured"
            toggleFavorite={toggleFavorite}
            onUpdateRecipe={(updatedRecipe) => {
              setFeaturedRecipes(prev => prev.map(recipe => 
                recipe.id === updatedRecipe.id ? updatedRecipe : recipe
              ));
            }}
            userId={userId}
            isAuthenticated={isAuthenticated}
          />
          <RecipeTab
            tabData={searchHistory}
            tabValue="history"
            toggleFavorite={toggleFavorite}
            onUpdateRecipe={(updatedRecipe) => {
              setSearchHistory(prev => prev.map(recipe => 
                recipe.id === updatedRecipe.id ? updatedRecipe : recipe
              ));
            }}
            userId={userId}
            isAuthenticated={isAuthenticated}
          />
          <RecipeTab
            tabData={favorites}
            tabValue="favorites"
            toggleFavorite={toggleFavorite}
            onUpdateRecipe={(updatedRecipe) => {
              setFavorites(prev => prev.map(recipe => 
                recipe.id === updatedRecipe.id ? updatedRecipe : recipe
              ));
            }}
            userId={userId}
            isAuthenticated={isAuthenticated}
          />
        </Tabs>
      </motion.div>

      <LoadingCard openModal={isPending}/>
    </>
  );
}
