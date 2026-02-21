export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbClient from "../../../db";
import redisClient from "../../../redis";
import { tmpdir } from "os";
import { join as joinPath } from "path";
import { mkdir, writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

interface FileDoc {
  userID: string;
  name?: string;
  fileID: string;
  type: string;
  isPublic: boolean;
  parentId: string;
  dateadded: Date;
  localPath?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { tok, image, name, type } = await request.json();

    if (!tok)
      return NextResponse.json({ error: "Token missing" }, { status: 400 });
    if (!type || type.split("/")[0] !== "image")
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    if (!image)
      return NextResponse.json({ error: "Image missing" }, { status: 400 });

    // Validate Redis auth
    const usr_id = await redisClient.get(`auth_${tok}`);
    if (!usr_id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // MongoDB Atlas usage
    const db = await dbClient.db();
    const usersCollection = db.collection("users");
    const filesCollection = db.collection<FileDoc>("files");

    const user = await usersCollection.findOne({ userID: usr_id });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 401 });

    const baseDir = joinPath(tmpdir(), "crudapp/profilepicimages");
    await mkdir(baseDir, { recursive: true });

    const ext = type.split("/")[1];
    const localPath = joinPath(baseDir, `${uuidv4()}.${ext}`);

    // Write image file to tmp
    await writeFile(localPath, Buffer.from(image, "base64"));

    // Check if user already has a file
    const existingFile = await filesCollection.findOne({ userID: usr_id });

    if (existingFile) {
      const updateResult = await filesCollection.updateOne(
        { userID: usr_id },
        { $set: { localPath } },
      );
      if (!updateResult.acknowledged) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
      }
      return NextResponse.json({ message: "Profile updated" }, { status: 200 });
    }

    // Insert new file record
    const newFile: FileDoc = {
      userID: usr_id,
      name,
      fileID: uuidv4(),
      type,
      isPublic: true,
      parentId: "0",
      dateadded: new Date(),
      localPath,
    };

    const insertResult = await filesCollection.insertOne(newFile);
    if (!insertResult.acknowledged) {
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "File uploaded successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Profile image upload error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
