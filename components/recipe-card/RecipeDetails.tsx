import React from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { RecipeSchema } from '@/schema/recipe';

interface RecipeDetailsProps {
  recipe: RecipeSchema;
};

const RecipeDetails = ({ recipe }: RecipeDetailsProps) => {
  return (
    <DialogContent className="bg-base-secondary min-w-5xl">
        <DialogHeader className="flex flex-col gap-6">
          <DialogTitle className="text-2xl font-bold text-center border-b-2 pb-2 border-base-100">
            {recipe.title}
          </DialogTitle>
          <DialogDescription className="aspect-video rounded-3xl overflow-hidden w-80 flex items-center justify-center mx-auto">
            <img
              src={recipe.imageUrl || "/hero-image2.jpg"}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-5 mt-4">
          <div className="flex flex-col gap-4 w-2/5">
            <h3 className="text-xl font-bold uppercase">Ingredients:</h3>
            <ScrollArea className="h-[300px] pr-4">
              <ul className="list-disc pl-5 flex flex-col gap-2 text-lg">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </ScrollArea>
          </div>
          <Separator orientation="vertical" className="bg-base-100" />
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold uppercase">Instructions:</h3>
            <ScrollArea className="h-[300px] pr-4">
              <ol className="list-decimal pl-5 flex flex-col gap-2 text-lg">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </ScrollArea>
          </div>
        </div>
        <div>
          <span className="uppercase font-bold">Recipe Generated at:</span>
          {new Date(
            (recipe?.timestamp as string) || Date.now()
          ).toLocaleString()}
        </div>
      </DialogContent>
  )
}

export default RecipeDetails