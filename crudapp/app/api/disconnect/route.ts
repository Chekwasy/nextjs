export const runtime = "nodejs";

import { NextResponse } from "next/server";
import redisClient from "../../../redis";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const tok = request.headers.get("tok");

    if (!tok) {
      return NextResponse.json({ message: "Token missing" }, { status: 400 });
    }

    // Check token in Redis
    const usr_id = await redisClient.get(`auth_${tok}`);

    if (!usr_id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Delete token (logout)
    await redisClient.del(`auth_${tok}`);

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 },
    );
  }
}
