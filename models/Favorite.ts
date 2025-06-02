import mongoose, { Document, Model, Types } from "mongoose";

export interface FavoriteModel extends Document {
  userId: Types.ObjectId;
  recipeId: Types.ObjectId;
  createdAt: Date;
}

const favoriteSchema = new mongoose.Schema<FavoriteModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recipe",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        const transformed = { ...ret };
        transformed.id = transformed._id.toString();
        delete transformed._id;
        delete transformed.__v;
        
        if (transformed.userId) {
          transformed.userId = transformed.userId.toString();
        }
        if (transformed.recipeId) {
          transformed.recipeId = transformed.recipeId.toString();
        }
        
        return transformed;
      }
    }
  }
);

// Create a compound index to ensure a user can only favorite a recipe once
favoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

const Favorite = (mongoose.models.Favorite as Model<FavoriteModel>) || mongoose.model<FavoriteModel>("Favorite", favoriteSchema);

export default Favorite; 