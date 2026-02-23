export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbClient from "../../../db";
import redisClient from "../../../redis";
import { put, del } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

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

    const imageBuffer = Buffer.from(image, "base64");

    if (imageBuffer.length > MAX_FILE_SIZE)
      return NextResponse.json(
        { error: "File exceeds 1MB limit" },
        { status: 400 },
      );

    const usr_id = await redisClient.get(`crud_auth_${tok}`);
    if (!usr_id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await dbClient.db();
    const filesCollection = db.collection("files");

    const existingFile = await filesCollection.findOne({ userID: usr_id });

    if (existingFile?.localPath) {
      try {
        await del(existingFile.localPath);
      } catch (err) {
        console.warn("Old blob deletion failed:", err);
      }
    }

    const ext = type.split("/")[1];
    const blobPath = `profilepics/${usr_id}-${uuidv4()}.${ext}`;

    const blob = await put(blobPath, imageBuffer, {
      access: "public",
      contentType: type,
    });

    const imageUrl = blob.url;

    await filesCollection.updateOne(
      { userID: usr_id },
      {
        $set: {
          userID: usr_id,
          name,
          localPath: imageUrl,
          type,
          dateadded: new Date(),
          isPublic: true,
          parentId: "0",
        },
        $setOnInsert: {
          fileID: uuidv4(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json(
      { message: "Profile updated", url: imageUrl },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile image upload error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
