import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const ENABLE_API_MOCKING = process.env.ENABLE_API_MOCKING;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

