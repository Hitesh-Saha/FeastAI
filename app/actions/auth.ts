"use server";

import connectDB from "@/lib/db";
import { createSession, deleteSession, getSession } from "@/lib/session";
import User from "@/models/User";
import { LogInActionState, LogInSchema, LogOutActionState } from "@/schema/auth";
import bcrypt from "bcryptjs";

export async function login(
  _prevState: LogInActionState,
  form: FormData
): Promise<LogInActionState> {
    try {
        await connectDB();
        const email = form.get("email") as string;
        const password = form.get("password") as string;

        const validatedFields = LogInSchema.safeParse({
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
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return {
                message: 'User does not exist',
                success: false
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return {
                message: 'Invalid credentials',
                success: false
            }
        }

        await createSession(user.id, user.name, user.avatar);
        return {
            message: 'Logged in to your account successfully!',
            success: true
        }
    
    } catch (err) {
        console.error(err);
        return {
            message: 'An error occurred while logging into your account.',
            success: false
        }
    }
}
 
export async function logout(__prevState: LogOutActionState) {
    try {
        await deleteSession();
        return {
            message: 'Logged Out Successfully!',
            success: true
        }
    } catch (err) {
        return {
            message: 'An error occurred while logging out from your account.',
            success: false
        } 
    }
}

export async function getIsAuthenticated() {
    const session = await getSession();
    const isAuthenticated = session ? true : false;
    return {isAuthenticated, session};
}