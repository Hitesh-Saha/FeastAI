import { ChefHat } from "lucide-react";

export const features = [
    {
      icon: ChefHat,
      title: "AI-Powered Recipes",
      description: "Get personalized recipe suggestions based on your available ingredients"
    },
    {
      icon: ChefHat,
      title: "Save Favorites",
      description: "Keep track of your favorite recipes and access them anytime"
    },
    {
      icon: ChefHat,
      title: "Smart Search",
      description: "Find recipes quickly with our intelligent search system"
    }
];

export const tabList = [
  { value: "recipes", label: "Recipes" },
  { value: "history", label: "History" },
  { value: "favorites", label: "Favorites" }
];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export const itemLeftFadeVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 2 }
  }
};
