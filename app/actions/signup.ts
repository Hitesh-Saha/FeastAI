"use server";

import { generateAvatar } from "@/lib/avatar-generator";
import connectDB from "@/lib/db";
import { createSession } from "@/lib/session";
import User from "@/models/User";
import { SignUpActionState, SignUpSchema } from "@/schema/signup";
import bcrypt from "bcryptjs";

export async function signup(
  _prevState: SignUpActionState,
  form: FormData
): Promise<SignUpActionState> {
  try {
    await connectDB();
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const validatedFields = SignUpSchema.safeParse({
      name,
      email,
      password,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Field Validation Error",
        success: false
      };
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return {
        message: 'Email already exists',
        success: false
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const avatar = await generateAvatar();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    await user.save();
    await createSession(user.id, user.name, user.avatar);
    return {
      message: 'Account created successfully!',
      success: true
    }
  } catch (err) {
    console.error(err);
    return {
      message: "An error occurred while creating your account",
      success: false
    };
  }
}