"use client";

import React from "react";
import { Card } from "../ui/card";
import { RecipeSchema } from "@/schema/recipe";

interface DetailsTabProps {
  recipe: RecipeSchema;
}

const DetailsTab = ({ recipe }: DetailsTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr,3fr] gap-8">
      <Card className="space-y-4 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-card-foreground">
          Ingredients
        </h3>
        <div className="pr-4">
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex gap-2 text-card-foreground/90">
                <span className="text-primary">•</span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card className="space-y-4 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-card-foreground">
          Instructions
        </h3>
        <div className="pr-4">
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-2">
                <span className="font-semibold text-primary">{index + 1}.</span>
                <p className="text-card-foreground/90">{instruction}</p>
              </li>
            ))}
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default DetailsTab;
