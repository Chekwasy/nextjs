export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbClient from "../../../db";
import redisClient from "../../../redis";

interface Worker {
  firstname: string;
  lastname: string;
  email: string;
  department?: string;
  age?: number;
  address?: string;
  mobile?: string;
  sex?: string;
  nationality?: string;
  dateadded?: Date;
  lastupdate?: Date;
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const tok = request.headers.get("tok");
    const firstname = request.headers.get("firstname");
    const lastname = request.headers.get("lastname");
    const email = request.headers.get("email");

    if (!tok || !firstname || !lastname || !email) {
      return NextResponse.json(
        { message: "Missing required headers" },
        { status: 400 },
      );
    }

    // Check auth token in Upstash
    const usr_id = await redisClient.get(`auth_${tok}`);
    if (!usr_id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Proper MongoDB Atlas usage
    const db = await dbClient.db();
    const workersCollection = db.collection<Worker>("workers");

    const result = await workersCollection.deleteOne({
      email,
      firstname,
      lastname,
    });

    if (!result.acknowledged || result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Worker not found or delete failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Worker deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Delete worker error:", err);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 400 },
    );
  }
}
