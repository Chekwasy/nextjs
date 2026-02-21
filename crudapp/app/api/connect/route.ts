import { NextResponse } from "next/server";
import dbClient from "../../../db";
import redisClient from "../../../redis";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

interface LoginRequestBody {
  auth_header: string;
}

interface User {
  userID: string;
  email: string;
  password: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: LoginRequestBody = await request.json();
    const { auth_header } = body;

    if (!auth_header) {
      return NextResponse.json(
        { message: "Missing auth header" },
        { status: 400 },
      );
    }

    // Expecting: "Basic base64string"
    const encoded_usr_str = auth_header.split(" ")[1];
    if (!encoded_usr_str) {
      return NextResponse.json(
        { message: "Invalid auth format" },
        { status: 400 },
      );
    }

    const decoded_usr_str = Buffer.from(encoded_usr_str, "base64").toString(
      "utf-8",
    );
    const [email, rawPassword] = decoded_usr_str.split(":");

    if (!email || !rawPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 },
      );
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(rawPassword)
      .digest("hex");

    // MongoDB Atlas (await db properly)
    const db = await dbClient.db();
    const usersCollection = db.collection<User>("users");

    const user = await usersCollection.findOne({ email });

    if (!user || user.password !== hashedPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Generate auth token
    const auth_token = uuidv4();

    // Upstash Redis (EX seconds for expiry)
    await redisClient.set(
      `auth_${auth_token}`,
      user.userID,
      { ex: 7 * 24 * 60 * 60 }, // 7 days
    );

    return NextResponse.json({ token: auth_token }, { status: 201 });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 400 },
    );
  }
}
