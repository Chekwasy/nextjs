export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbClient from "../../../db";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

interface User {
  userID: string;
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  createdAt: Date;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { emailpwd, firstname, lastname } = body;

    if (!emailpwd) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 },
      );
    }

    // Expecting format: "Basic base64(email:password)"
    const encodedPart = emailpwd.split(" ")[1];
    if (!encodedPart) {
      return NextResponse.json(
        { error: "Invalid credential format" },
        { status: 400 },
      );
    }

    const decoded = Buffer.from(encodedPart, "base64").toString("utf-8");
    const [email, rawPassword] = decoded.split(":");

    if (!email || !rawPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 },
      );
    }

    // Hash password
    const password = crypto
      .createHash("sha256")
      .update(rawPassword)
      .digest("hex");

    const userID = uuidv4();

    // MongoDB Atlas correct usage
    const db = await dbClient.db();
    const usersCollection = db.collection<User>("users");

    // Check if user exists
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }, // Conflict
      );
    }

    // Insert new user
    const result = await usersCollection.insertOne({
      userID,
      email,
      password,
      firstname,
      lastname,
      createdAt: new Date(),
    });

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: "User creation failed" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "User created successfully", email },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
