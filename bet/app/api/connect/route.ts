import dbClient from "../../../db";
import { NextResponse } from "next/server";
import redisClient from "../../../redis";
import { makeID, checkpwd } from "../../tools/func";
import crypto from "crypto";
import { Db } from "mongodb";

interface LoginRequestBody {
  auth_header: string;
}

interface User {
  _id?: string;
  email: string;
  password: string;
  userID: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: LoginRequestBody = await request.json();
    const { auth_header } = body;

    if (!auth_header) {
      return NextResponse.json(
        { message: "Unset auth header" },
        { status: 400 },
      );
    }

    // Validate Basic format
    const parts: string[] = auth_header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Basic") {
      return NextResponse.json(
        { message: "Invalid auth format" },
        { status: 400 },
      );
    }

    const encodedUsrStr: string = parts[1];
    const decodedUsrStr: string = Buffer.from(encodedUsrStr, "base64").toString(
      "utf-8",
    );

    const usrDetails: string[] = decodedUsrStr.split(":");

    if (usrDetails.length !== 2) {
      return NextResponse.json(
        { message: "Invalid credentials format" },
        { status: 400 },
      );
    }

    const email: string = usrDetails[0];
    const plainPwd: string = usrDetails[1];

    // Validate password format
    if (!checkpwd(plainPwd)) {
      return NextResponse.json(
        { message: "Invalid password format" },
        { status: 401 },
      );
    }

    // Validate email format
    if (!checkpwd(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 401 },
      );
    }

    const hashedPwd: string = crypto
      .createHash("sha256")
      .update(plainPwd)
      .digest("hex");

    // MongoDB
    const db: Db = await dbClient.db();
    const user: User | null = await db
      .collection<User>("users")
      .findOne({ email });

    const tok: string | null = await redisClient.get(email);

    if (tok && parseInt(tok) > 5) {
      return NextResponse.json(
        { message: "Too many failed attempts. Try again later." },
        { status: 429 },
      );
    }

    if (user && user.password === hashedPwd) {
      await redisClient.del(email);

      const authToken: string = makeID();

      await redisClient.set(`auth_${authToken}`, user.userID, {
        EX: 24 * 60 * 60,
      });

      return NextResponse.json(
        { token: authToken, message: "Login Successful" },
        { status: 200 },
      );
    }

    // Failed login
    if (!tok) {
      await redisClient.set(email, "1", { EX: 24 * 60 * 60 });
    } else {
      await redisClient.set(email, (parseInt(tok) + 1).toString(), {
        EX: 24 * 60 * 60,
      });
    }

    return NextResponse.json(
      { message: "Email or Password Incorrect" },
      { status: 400 },
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Error processing signin" },
      { status: 500 },
    );
  }
}
