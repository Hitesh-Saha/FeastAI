import mongoose, { Document, Model, Types } from "mongoose";

interface Review {
  userId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

interface Nutrition {
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface RecipeModel extends Document {
  title: string;
  ingredients: string[];
  instructions: string[];
  imageUrl: string;
  timestamp: Date;
  user: Types.ObjectId;
  reviews: Review[];
  averageRating: number;
  nutrition: Nutrition;
  dietaryTags: string[];
  suggestedPairings: string[];
  modifiedFrom?: Types.ObjectId;
  servings: number;
  cookingTime: number;
  isPublic: boolean;
}

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const nutritionSchema = new mongoose.Schema({
  calories: Number,
  protein: Number,
  carbohydrates: Number,
  fat: Number,
  fiber: Number,
  sugar: Number,
  sodium: Number,
});

const recipeSchema = new mongoose.Schema<RecipeModel>(
  {
    title: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    instructions: {
      type: [String],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0,
    },
    nutrition: nutritionSchema,
    dietaryTags: {
      type: [String],
      default: [],
    },
    suggestedPairings: {
      type: [String],
      default: [],
    },
    modifiedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recipe",
    },
    servings: {
      type: Number,
      required: true,
      default: 4,
    },
    cookingTime: {
      type: Number,
      required: true,
      default: 30,
    },
    isPublic: {
      type: Boolean,
      default: true,
    }
  },  
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        const transformed = { ...ret };
        
        // Handle ID transformations
        transformed.id = transformed._id.toString();
        delete transformed._id;
        delete transformed.__v;

        // Handle user ID transformation
        if (transformed.user) {
          if (typeof transformed.user === "object" && transformed.user._id) {
            transformed.user = transformed.user._id.toString();
          } else if (typeof transformed.user.toString === "function") {
            transformed.user = transformed.user.toString();
          }
        }

        // Handle nutrition with fallback values
        if (transformed.nutrition) {
          const nutrition = transformed.nutrition;
          transformed.nutrition = {
            calories: Number(nutrition.calories) || 0,
            protein: Number(nutrition.protein) || 0,
            carbohydrates: Number(nutrition.carbohydrates) || 0,
            fat: Number(nutrition.fat) || 0,
            fiber: Number(nutrition.fiber) || 0,
            sugar: Number(nutrition.sugar) || 0,
            sodium: Number(nutrition.sodium) || 0
          };
        } else {
          transformed.nutrition = {
            calories: 0,
            protein: 0,
            carbohydrates: 0,
            fat: 0,
            fiber: 0,
            sugar: 0,
            sodium: 0
          };
        }

        // Handle reviews array
        if (Array.isArray(transformed.reviews)) {
          transformed.reviews = transformed.reviews.map(review => ({
            userId: review.userId.toString(),
            rating: Number(review.rating),
            comment: review.comment || "",
            createdAt: new Date(review.createdAt).toISOString()
          }));
        } else {
          transformed.reviews = [];
        }

        // Handle modifiedFrom
        if (transformed.modifiedFrom) {
          transformed.modifiedFrom = transformed.modifiedFrom.toString();
        }

        // Handle timestamp
        if (transformed.timestamp) {
          transformed.timestamp = new Date(transformed.timestamp).toISOString();
        }

        return transformed;
      }
    },    
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        const transformed = { ...ret };
        
        // Handle ID transformations
        transformed.id = transformed._id.toString();
        delete transformed._id;
        delete transformed.__v;

        // Handle user ID transformation
        if (transformed.user) {
          if (typeof transformed.user === "object" && transformed.user._id) {
            transformed.user = transformed.user._id.toString();
          } else if (typeof transformed.user.toString === "function") {
            transformed.user = transformed.user.toString();
          }
        }

        // Handle nutrition with fallback values
        if (transformed.nutrition) {
          const nutrition = transformed.nutrition;
          transformed.nutrition = {
            calories: Number(nutrition.calories) || 0,
            protein: Number(nutrition.protein) || 0,
            carbohydrates: Number(nutrition.carbohydrates) || 0,
            fat: Number(nutrition.fat) || 0,
            fiber: Number(nutrition.fiber) || 0,
            sugar: Number(nutrition.sugar) || 0,
            sodium: Number(nutrition.sodium) || 0
          };
        } else {
          transformed.nutrition = {
            calories: 0,
            protein: 0,
            carbohydrates: 0,
            fat: 0,
            fiber: 0,
            sugar: 0,
            sodium: 0
          };
        }

        // Handle reviews array
        if (Array.isArray(transformed.reviews)) {
          transformed.reviews = transformed.reviews.map(review => ({
            userId: review.userId.toString(),
            rating: Number(review.rating),
            comment: review.comment || "",
            createdAt: new Date(review.createdAt).toISOString()
          }));
        } else {
          transformed.reviews = [];
        }

        // Handle modifiedFrom
        if (transformed.modifiedFrom) {
          transformed.modifiedFrom = transformed.modifiedFrom.toString();
        }

        // Handle timestamp
        if (transformed.timestamp) {
          transformed.timestamp = new Date(transformed.timestamp).toISOString();
        }

        return transformed;
      }
    },
  }
);

// recipeSchema.index({ user: 1, title: 1 }, { unique: true });

const Recipe: Model<RecipeModel> =
  mongoose.models.recipe || mongoose.model("recipe", recipeSchema);

export default Recipe;
