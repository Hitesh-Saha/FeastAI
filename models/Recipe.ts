import mongoose, { Document, Model, Types } from "mongoose";

export interface RecipeModel extends Document {
  title: string;
  ingredients: string[];
  instructions: string[];
  imageUrl: string;
  timestamp: Date;
  isFavorite: boolean;
  user: Types.ObjectId;
}

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
    isFavorite: {
      type: Boolean,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        if (ret.user && typeof ret.user === "object" && ret.user._id) {
          ret.user = ret.user._id.toString();
        } else if (ret.user && typeof ret.user.toString === "function") {
          ret.user = ret.user.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        if (ret.user && typeof ret.user === "object" && ret.user._id) {
          ret.user = ret.user._id.toString();
        } else if (ret.user && typeof ret.user.toString === "function") {
          ret.user = ret.user.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// recipeSchema.index({ user: 1, title: 1 }, { unique: true });

const Recipe: Model<RecipeModel> =
  mongoose.models.recipe || mongoose.model("recipe", recipeSchema);

export default Recipe;
