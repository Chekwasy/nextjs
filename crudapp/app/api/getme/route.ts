export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbClient from "../../../db";
import redisClient from "../../../redis";

interface User {
  userID: string;
  email: string;
  firstname?: string;
  lastname?: string;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const tok = request.headers.get("tok");

    if (!tok) {
      return NextResponse.json({ message: "Token missing" }, { status: 400 });
    }

    // Check token in Redis
    const usr_id = await redisClient.get(`crud_auth_${tok}`);

    if (!usr_id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Correct MongoDB Atlas usage
    const db = await dbClient.db();
    const usersCollection = db.collection<User>("users");

    const user = await usersCollection.findOne({
      userID: usr_id,
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ email: user.email }, { status: 200 });
  } catch (error) {
    console.error("Get user error:", error);

    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 },
    );
  }
}
