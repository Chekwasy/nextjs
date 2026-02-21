export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbClient from "../../../db";
import redisClient from "../../../redis";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const tok = request.headers.get("tok");
    const pg = request.headers.get("pg");

    if (!tok) {
      return NextResponse.json({ error: "Token missing" }, { status: 400 });
    }

    // Redis authentication
    const usr_id = await redisClient.get(`auth_${tok}`);
    if (!usr_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // MongoDB Atlas collection
    const db = await dbClient.db();
    const workersCollection = db.collection("workers");

    // Pagination
    const pageSize = 2;
    const page = pg ? parseInt(pg) : 1;
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page number" },
        { status: 400 },
      );
    }

    const workers = await workersCollection
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return NextResponse.json({ workers }, { status: 200 });
  } catch (error) {
    console.error("Get workers error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
