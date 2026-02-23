export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbClient from "../../../db";
import redisClient from "../../../redis";
import { put, del } from "@vercel/blob";
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

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { tok, image, name, type } = await request.json();

    if (!tok)
      return NextResponse.json({ error: "Token missing" }, { status: 400 });

    if (!type || !type.startsWith("image/"))
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });

    if (!image)
      return NextResponse.json({ error: "Image missing" }, { status: 400 });

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(image, "base64");

    // Backend size validation
    if (imageBuffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 1MB limit" },
        { status: 400 },
      );
    }

    // Validate Redis auth
    const usr_id = await redisClient.get(`crud_auth_${tok}`);
    if (!usr_id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await dbClient.db();
    const usersCollection = db.collection("users");
    const filesCollection = db.collection<FileDoc>("files");

    const user = await usersCollection.findOne({ userID: usr_id });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 401 });

    // Check if user already has file
    const existingFile = await filesCollection.findOne({ userID: usr_id });

    // If exists → delete old blob first
    if (existingFile?.localPath) {
      try {
        await del(existingFile.localPath);
      } catch (err) {
        console.warn("Old blob deletion failed:", err);
      }
    }

    // Upload new file to Blob
    const ext = type.split("/")[1];
    const blobPath = `profilepics/${usr_id}-${uuidv4()}.${ext}`;

    const blob = await put(blobPath, imageBuffer, {
      access: "public",
      contentType: type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const imageUrl = blob.url;

    // If existing → update
    if (existingFile) {
      const updateResult = await filesCollection.updateOne(
        { userID: usr_id },
        {
          $set: {
            localPath: imageUrl,
            type,
            dateadded: new Date(),
          },
        },
      );

      if (!updateResult.acknowledged)
        return NextResponse.json({ error: "Update failed" }, { status: 500 });

      return NextResponse.json(
        { message: "Profile updated", url: imageUrl },
        { status: 200 },
      );
    }

    // Otherwise insert new record
    const newFile: FileDoc = {
      userID: usr_id,
      name,
      fileID: uuidv4(),
      type,
      isPublic: true,
      parentId: "0",
      dateadded: new Date(),
      localPath: imageUrl,
    };

    const insertResult = await filesCollection.insertOne(newFile);

    if (!insertResult.acknowledged)
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });

    return NextResponse.json(
      { message: "File uploaded successfully", url: imageUrl },
      { status: 201 },
    );
  } catch (error) {
    console.error("Profile image upload error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
