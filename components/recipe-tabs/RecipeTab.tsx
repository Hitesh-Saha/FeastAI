import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import RecipeCard from "@/components/recipe-card/RecipeCard";
import { RecipeSchema } from "@/schema/recipe";
import { TabType } from "@/schema/common";

interface RecipeTabProps {
    tabData: RecipeSchema[];
    tabValue: TabType;
    toggleFavorite: (recipeId: string) => void;
    onUpdateRecipe?: (updatedRecipe: RecipeSchema) => void;
    userId?: string;
    isAuthenticated?: boolean;
}

const RecipeTab = ({tabData, tabValue, toggleFavorite, onUpdateRecipe, userId, isAuthenticated}: RecipeTabProps) => {
  return (
    <TabsContent value={tabValue}>
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {tabData.map((recipe, index) => (
          <RecipeCard            
            key={index}
            isOwner={recipe.user !== "" && recipe.user === userId}
            recipe={recipe}
            currentTab={tabValue}
            onFavorite={toggleFavorite}
            onUpdate={onUpdateRecipe}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </motion.div>
      {tabData.length === 0 && (
        <div className="text-center text-primary py-8">
          {tabValue === 'history' ? 'Your search history will appear here' : tabValue === 'favorites' ? 'Your favorite recipes will appear here' : tabValue === 'featured' ? 'No featured recipes found' : 'No recipes found'}
        </div>
      )}
    </TabsContent>
  );
};

export default RecipeTab;
