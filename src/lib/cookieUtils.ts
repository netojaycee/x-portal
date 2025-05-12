import Cookies from "js-cookie";

interface CookieOptions {
    expires?: number | Date;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
}

export const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
    const defaultOptions: CookieOptions = {
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        ...options,
    };
    Cookies.set(name, value, defaultOptions);
};

export const getCookie = <T>(name: string): T | null => {
    const value = Cookies.get(name);
    if (!value) return null;
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
};