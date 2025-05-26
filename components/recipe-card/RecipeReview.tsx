"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { rateRecipe } from "@/app/actions/recipe";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { RecipeSchema } from "@/schema/recipe";

interface Review {
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface RecipeReviewProps {
  recipeId: string;
  currentRating?: number;
  averageRating: number;
  totalReviews: number;
  reviews?: Review[];
  recipe: RecipeSchema;
  onUpdate?: (updatedRecipe: RecipeSchema) => void;
}

export const RecipeReview = ({
  recipeId,
  currentRating,
  averageRating,
  totalReviews,
  reviews = [],
  recipe,
  onUpdate,
}: RecipeReviewProps) => {
  const [rating, setRating] = useState(currentRating || 0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews);

  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("rating", rating.toString());
    if (comment) formData.append("comment", comment);

    const result = await rateRecipe(recipeId, formData);
    if (result.success && result.data) {
      toast.success(result.message);
      setComment("");

      // Update local state
      const updatedRecipe = result?.data as RecipeSchema;
      setRating(
        updatedRecipe.reviews?.find((r) => r.userId === recipe.user)?.rating ||
          0
      );
      setLocalReviews(updatedRecipe.reviews || []);

      // Update parent component
      if (onUpdate) {
        onUpdate(updatedRecipe);
      }
    } else {
      toast.error(result.message || "Failed to submit review");
    }

    setIsSubmitting(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 rounded-xl flex flex-col gap-6">
        {/* Overall Rating Display */}
          <div className="flex flex-col md:flex-row items-center gap-4 pb-6 border-b">
            <div className="flex flex-col items-center px-6 py-4 bg-secondary/50 rounded-xl">
              <span className="text-3xl font-bold">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`w-4 h-4 ${
                      value <= averageRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground mt-1">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </span>
            </div>

            {/* Your Rating Input */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Rate this recipe</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="group relative"
                  >
                    <Star
                      className={`w-8 h-8 transition-all hover:scale-110 ${
                        value <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200 hover:text-yellow-300"
                      }`}
                    />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {["Poor", "Fair", "Good", "Great", "Excellent"][value - 1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        {/* Review Form */}
        <form onSubmit={handleRatingSubmit} className="space-y-4">
          <div className="space-y-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this recipe..."
              className="w-full p-4 bg-secondary/20 border-0 rounded-xl resize-none focus:ring-2 focus:ring-primary/20 min-h-[120px]"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Your review will help others discover great recipes.
            </p>
          </div>
          <Button
            type="submit"
            disabled={!rating || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Card>

      {/* Reviews List */}
      {localReviews.length > 0 && (
        <Card className="mt-8 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Recent Reviews</h3>
            {localReviews.length > 3 && (
              <Button
                variant="ghost"
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-sm hover:bg-secondary/80"
              >
                {showAllReviews ? (
                  <>
                    Show Less <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show All <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>

          <ScrollArea className={showAllReviews ? "h-[400px] pr-4" : "h-auto"}>
            <div className="space-y-4">
              {(showAllReviews ? localReviews : localReviews.slice(0, 3)).map(
                (review, index) => (
                  <div
                    key={index}
                    className="p-4 bg-secondary/20 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Star
                            key={value}
                            className={`w-4 h-4 ${
                              value <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {review.comment}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};
