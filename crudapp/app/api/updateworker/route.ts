export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbClient from "../../../db";
import redisClient from "../../../redis";

interface WorkerUpdateRequest {
  tok: string;
  age?: number;
  department?: string;
  address?: string;
  mobile?: string;
  email: string;
}

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const body: WorkerUpdateRequest = await request.json();
    const { tok, age, department, address, mobile, email } = body;

    if (!tok || !email) {
      return NextResponse.json(
        { error: "Missing token or email" },
        { status: 400 },
      );
    }

    // Check Redis auth
    const usr_id = await redisClient.get(`crud_auth_${tok}`);
    if (!usr_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // MongoDB Atlas usage
    const db = await dbClient.db();
    const workersCollection = db.collection("workers");

    const lastupdate = new Date();

    const updateResult = await workersCollection.updateOne(
      { email },
      {
        $set: {
          ...(age !== undefined && { age }),
          ...(department && { department }),
          ...(address && { address }),
          ...(mobile && { mobile }),
          lastupdate,
        },
      },
    );

    if (!updateResult.acknowledged) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Update successful" }, { status: 200 });
  } catch (error) {
    console.error("Worker update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
