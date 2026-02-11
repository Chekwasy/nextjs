import { NextResponse } from "next/server";
import dbClient from "../../../db";
import redisClient from "../../../redis";
import { checkpwd } from "../../tools/func";
import Queue from "bull";
import { Db } from "mongodb";

interface User {
  _id?: string;
  email: string;
  password?: string;
  userID?: string;
  [key: string]: any;
}

interface TokenPayload {
  token: string;
  count: number;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const dd = await request.json();
    const { email } = dd;

    if (!email || !checkpwd(email)) {
      return NextResponse.json("error", { status: 400 });
    }

    // --- Use typed Db instance ---
    const db: Db = await dbClient.db();
    const user: User | null = await db
      .collection<User>("users")
      .findOne({ email });

    if (!user) {
      return NextResponse.json("error", { status: 400 });
    }

    // Generate numeric token
    const min = 123456;
    const max = 987654;
    const token = Math.floor(Math.random() * (max - min + 1)) + min;

    // Store token in Redis for 10 minutes
    await redisClient.del(email);
    await redisClient.set(email, `${token}1`, { EX: 10 * 60 }); // using EX in seconds

    // Create Bull queue to send email token
    const tokenQueue = new Queue("Send Trybet Token");
    const payload: TokenPayload = { token: token.toString(), count: 0 };
    await tokenQueue.add({ email, token: payload });

    return NextResponse.json({ email: user.email }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json("error", { status: 400 });
  }
}
