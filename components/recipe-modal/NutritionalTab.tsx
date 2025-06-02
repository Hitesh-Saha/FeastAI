"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRecipeWithNutrition, updateRecipeDietary } from "@/app/actions/recipe";
import { toast } from "sonner";

interface Nutrition {
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

interface NutritionalTabProps {
  recipeId: string;
  initialNutrition?: Nutrition;
  initialDietaryTags?: string[];
  servings: number;
}

const NutritionalTab = ({
  recipeId,
  initialNutrition,
  initialDietaryTags = [],
  servings,
}: NutritionalTabProps) => {
  const [nutrition, setNutrition] = useState<Nutrition>(initialNutrition || {});
  const [dietaryTags, setDietaryTags] = useState<string[]>(initialDietaryTags);
  const [selectedServings, setSelectedServings] = useState(servings);

  useEffect(() => {
    if (!initialNutrition) {
      loadNutritionData();
    }
  }, [initialNutrition]);

  const loadNutritionData = async () => {
    const result = await getRecipeWithNutrition(recipeId);
    if (result.success && result.recipe) {
      setNutrition(result.recipe.nutrition);
    }
  };

  const handleDietaryUpdate = async (tags: string[]) => {
    const result = await updateRecipeDietary(recipeId, tags);
    if (result.success) {
      setDietaryTags(tags);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const calculateNutritionPerServing = (value?: number) => {
    if (!value) return "N/A";
    const perServingValue = value / servings;
    return (perServingValue * selectedServings).toFixed(1);
  };

  const dietaryOptions = [
    "Non-Vegetarian",
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Low-Carb",
    "Keto",
    "Paleo",
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 rounded-xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex flex-col gap-4 items-start justify-between mb-6">
              <h3 className="text-xl font-semibold">Nutritional Information</h3>
              <div className="flex items-center gap-3">
                <Label htmlFor="servings" className="text-sm text-muted-foreground">
                  Adjust Servings
                </Label>
                <Select
                  value={selectedServings.toString()}
                  onValueChange={(value) => setSelectedServings(Number(value))}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Select servings" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 6, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "serving" : "servings"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {Object.entries(nutrition).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm font-medium capitalize">{key}</span>
                    <span className="text-sm tabular-nums">
                      {calculateNutritionPerServing(value)} {key === "sodium" ? "mg" : key === "calories" ? "kcal" : "g"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-72 space-y-4">
            <h4 className="font-medium">Dietary Tags</h4>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const newTags = dietaryTags.includes(tag)
                      ? dietaryTags.filter((t) => t !== tag)
                      : [...dietaryTags, tag];
                    handleDietaryUpdate(newTags);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-90 ${
                    dietaryTags.includes(tag)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NutritionalTab;