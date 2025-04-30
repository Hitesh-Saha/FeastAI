import { JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload {
    userId: string;
    name: string;
    expiresAt: Date
};

export type TabType = 'recipes' | 'history' | 'favorites';