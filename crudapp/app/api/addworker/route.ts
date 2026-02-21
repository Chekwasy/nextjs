import { NextResponse } from "next/server";
import dbClient from "../../../db";
import redisClient from "../../../redis";

interface CreateWorkerBody {
  tok: string;
  firstname: string;
  lastname: string;
  age: number;
  department: string;
  address: string;
  mobile: string;
  sex: string;
  nationality: string;
  email: string;
}

interface Worker {
  firstname: string;
  lastname: string;
  age: number;
  department: string;
  address: string;
  mobile: string;
  sex: string;
  nationality: string;
  email: string;
  dateadded: Date;
  lastupdate: Date;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: CreateWorkerBody = await request.json();
    const {
      tok,
      firstname,
      lastname,
      age,
      department,
      address,
      mobile,
      sex,
      nationality,
      email,
    } = body;

    if (!tok) {
      return NextResponse.json({ message: "Token required" }, { status: 400 });
    }

    const usr_id = await redisClient.get(`auth_${tok}`);
    if (!usr_id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await dbClient.db();
    const workersCollection = db.collection<Worker>("workers");

    const now = new Date();

    const result = await workersCollection.insertOne({
      firstname,
      lastname,
      age,
      department,
      address,
      mobile,
      sex,
      nationality,
      email,
      dateadded: now,
      lastupdate: now,
    });

    if (!result.acknowledged) {
      return NextResponse.json({ message: "Insert failed" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Worker created successfully", id: result.insertedId },
      { status: 201 },
    );
  } catch (err) {
    console.error("Create worker error:", err);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 400 },
    );
  }
}
