import { JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload {
    userId: string;
    name: string;
    avatar: string;
    expiresAt: Date
};

export type TabType = 'recipes' | 'history' | 'favorites' | 'featured';

export interface Feature {
    title: string;
    description: string;
    icon: any;
}

export interface Usage {
    title: string;
    imageUrl: string;
    description: string;
}

export interface DietaryPreference {
    value: string;
    label: string;
}

export interface TabOptions {
    icon: any;
    label: string;
    value: TabType;
}