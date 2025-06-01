import { DietaryPreference, Feature, RecipeModalTab, TabOptions, TabType, Usage } from "@/schema/common";
import {
  AppWindowMac,
  ChefHat,
  ClipboardList,
  FolderHeart,
  Heart,
  Plus,
  Salad,
  Sparkles,
  Utensils,
  History
} from "lucide-react";

export const features: Feature[] = [
  {
    icon: ChefHat,
    title: "AI-Powered Recipes",
    description:
      "Get AI generated personalized recipes based on the ingredients you have at hand. Whether it's a quick meal or a gourmet dish, we've got you covered!",
  },
  {
    icon: FolderHeart,
    title: "Save Your Favorites",
    description:
      "Keep track of your favorite recipes for future use and access them anytime and anywhere.",
  },
  {
    icon: Utensils,
    title: "Personalized To Your Dietary Needs",
    description:
      "Choose recipes that fit your lifestyle. Whether you're vegan, vegetarian, gluten-free, non-vegetarian, our AI accomodates your dietary preferences with ease.",
  },
  {
    icon: AppWindowMac,
    title: "User-Friendly Interface",
    description:
      "Enjoy a clean and intuitive interface that makes recipe generation a breeze",
  },
  {
    icon: ClipboardList,
    title: "Recipe History",
    description:
      "Easily access your recipe history and revisit your favorite creations",
  },
  {
    icon: Salad,
    title: "Customise The Number Of Recipes",
    description:
      "Select the number of recipes you want to generate at once, making meal planning easier than ever",
  },
];

export const usageList: Usage[] = [
  {
    imageUrl: "/usage-image1.png",
    title: "1. Enter Your Ingredients",
    description:
      "Start by typing in the ingredients you have in your kitchen. Our AI can work with whatever you've got, whether it's just a few items or a full stocked pantry!"
  },
  {
    imageUrl: "/usage-image2.png",
    title: "2. Customize Your Preferences",
    description:
      "Choose your dietary preferences, whether you're a vegan, vegetarian or non-vegetarian, you can tailor the recipe to fit your needs.",
  },
  {
    imageUrl: "/usage-image3.png",
    title: "3. AI Processing",
    description:
      "Hang tight! We're whipping up your personalized recipe based on the ingredients you shared. In just a moment, you'll have a delicious dish ready to cook!",
  },
  {
    imageUrl: "/usage-image4.png",
    title: "4. Cook, Savor, and Enjoy",
    description:
      "Get cooking with your AI-generated recipes! Follow the step-by-step instructions and enjoy your meal.",
  },
  {
    imageUrl: "/usage-image5.png",
    title: "5. Save Your Favorites",
    description:
      "Bookmark your favorite recipes for easy access later. No more searching through your history!",
  },
  {
    imageUrl: "/usage-image6.png",
    title: "6. Explore Your History",
    description:
      "View your past recipes and rediscover your culinary creations.",
  },
];

export const tabOptions: TabOptions[] = [
  {
    icon: Plus,
    label: "Create Recipe",
    value: "recipes"
  },
  {
    icon: Sparkles,
    label: "Featured",
    value: "featured"
  },
  {
    icon: History,
    label: "History",
    value: "history"
  },
  {
    icon: Heart,
    label: "Favorites",
    value: "favorites"
  }
];

export const preferenceList: DietaryPreference[] = [
  { value: "all", label: "All" },
  { value: "vegan", label: "Vegan" },
  { value: "veg", label: "Vegetarian" },
  { value: "non-veg", label: "Non-Vegetarian" },
  { value: "gluten-free", label: "Gluten Free" },
  { value: "dairy-free", label: "Dairy Free" },
  { value: "nut-free", label: "Nut Free" },
];

export const ignoredIngredients: string[] = [
  'petrol',
  'gasoline',
  'diesel',
  'wood',
  'plastic',
  'metal',
  'glass',
  'rubber',
  'paper',
  'cardboard',
  'styrofoam',
  'aluminum',
  'copper',
  'lead',
  'zinc',
  'iron',
  'steel',
  'tin',
  'nickel',
  'clothes',
  'fabric',
  'leather',
  'fur',
  'wool',
  'silk',
  'nylon',
  'polyester',
  'acrylic',
  'spandex',
  'rayon',
  'acetate',
];

export const dietaryConflictMap: Record<string, string[]> = {
  chicken: ["vegan", "veg"],
  beef: ["vegan", "veg"],
  pork: ["vegan", "veg"],
  lamb: ["vegan", "veg"],
  meat: ["vegan", "veg"],
  turkey: ["vegan", "veg"],
  duck: ["vegan", "veg"],
  tofu: ["non-veg"],
  shrimp: ["vegan", "veg"],
  crab: ["vegan", "veg"],
  lobster: ["vegan", "veg"],
  prawn: ["vegan", "veg"],
  squid: ["vegan", "veg"],
  fish: ["vegan", "veg"],
  egg: ["vegan"],
  milk: ["vegan", "dairy-free"],
  cheese: ["vegan", "dairy-free"],
  butter: ["vegan", "dairy-free"],
  wheat: ["gluten-free"],
  barley: ["gluten-free"],
  rye: ["gluten-free"],
  oats: ["gluten-free"],
  bread: ["gluten-free"],
  pasta: ["gluten-free"],
  cereal: ["gluten-free"],
  flour: ["gluten-free"],
  almond: ["nut-free"],
  peanut: ["nut-free"],
  cashew: ["nut-free"],
  walnut: ["nut-free"],
  hazelnut: ["nut-free"],
  pistachio: ["nut-free"],
  pecan: ["nut-free"],
  coconut: ["nut-free"],
};


export const recipeModalTabs: RecipeModalTab[] = [
  {
    label: "Recipe",
    value: "recipe"
  },
  {
    label: "Nutrition",
    value: "nutrition"
  },
  {
    label: "Reviews",
    value: "review"
  }
]
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1,
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

export const itemLeftFadeVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 2 },
  },
};
