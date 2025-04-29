import mongoose, { Document, Model } from 'mongoose';

export interface UserModel extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserModel>({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
},
{
  timestamps: true
}
);

const User: Model<UserModel> = mongoose.models.user || mongoose.model('user', userSchema);

export default User;