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
}

const RecipeTab = ({tabData, tabValue, toggleFavorite}: RecipeTabProps) => {
  return (
    <TabsContent value={tabValue}>
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {tabData.map((recipe, index) => (
          <RecipeCard
            key={index}
            recipe={recipe}
            currentTab={tabValue}
            onFavorite={toggleFavorite}
          />
        ))}
      </motion.div>
      {tabData.length === 0 && (
        <div className="text-center text-primary py-8">
          Your search history will appear here
        </div>
      )}
    </TabsContent>
  );
};

export default RecipeTab;
