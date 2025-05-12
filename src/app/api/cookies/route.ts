import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Get the token cookie
        const token = req.cookies.get("xtk")?.value;

        // Example: If you need to check if token exists
        if (!token) {
            return NextResponse.json({ error: "Token not found" }, { status: 401 });
        }

        // Placeholder: Replace with actual logic to fetch blogs

        return NextResponse.json(token, { status: 200 });
    } catch (error) {
        console.error("Fetch blogs error:", error);
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}