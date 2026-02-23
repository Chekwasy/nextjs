export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbClient from "../../../db";
import redisClient from "../../../redis";

interface FileDoc {
  userID: string;
  localPath: string;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Extract token from cookie OR header
    const cookieToken = request.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("tok="))
      ?.split("=")[1];

    const headerToken = request.headers.get("tok");
    const tok = cookieToken || headerToken;

    if (!tok)
      return NextResponse.json({ error: "Token missing" }, { status: 400 });

    const userID = await redisClient.get(`crud_auth_${tok}`);
    if (!userID)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await dbClient.db();
    const filesCollection = db.collection<FileDoc>("files");

    const file = await filesCollection.findOne({ userID });

    // If user has no profile image → redirect to default image
    if (!file?.localPath) {
      return NextResponse.json({
        url: "/default-profile.jpg",
      });
    }

    // Redirect directly to Blob CDN URL
    return NextResponse.json({ url: file.localPath });
  } catch (error) {
    console.error("Profile image error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
