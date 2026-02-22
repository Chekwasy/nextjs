export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbClient from "../../../db";
import redisClient from "../../../redis";

import { tmpdir } from "os";
import { join as joinPath } from "path";
import { mkdir, stat, realpath, readFile } from "fs/promises";
import { existsSync } from "fs";
import mime from "mime-types";

interface FileDoc {
  userID: string;
  localPath: string;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Extract token from cookie OR header
    const cookieToken = request.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("tok="))
      ?.split("=")[1];

    const headerToken = request.headers.get("tok");

    const tok = cookieToken || headerToken;

    if (!tok) {
      return NextResponse.json({ error: "Token missing" }, { status: 400 });
    }

    // Check Redis session
    const userID = await redisClient.get(`crud_auth_${tok}`);

    if (!userID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // MongoDB Atlas usage
    const db = await dbClient.db();
    const filesCollection = db.collection<FileDoc>("files");

    const file = await filesCollection.findOne({ userID });

    const baseDir = joinPath(tmpdir(), "crudapp/profilepicimages");
    const defaultPath = joinPath(baseDir, "default.jpg");

    // If user has no custom profile image → serve default
    if (!file) {
      await mkdir(baseDir, { recursive: true });

      if (!existsSync(defaultPath)) {
        return NextResponse.json(
          { error: "Default image missing" },
          { status: 404 },
        );
      }

      const absoluteFilePath = await realpath(defaultPath);
      const fileBuffer = await readFile(absoluteFilePath);
      const mimeType = mime.lookup(defaultPath) || "image/jpeg";

      return new NextResponse(new Uint8Array(fileBuffer), {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Cache-Control": "no-cache, max-age=0",
        },
      });
    }

    // Validate stored file path
    const filePath = file.localPath;

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found on server" },
        { status: 404 },
      );
    }

    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const absoluteFilePath = await realpath(filePath);
    const fileBuffer = await readFile(absoluteFilePath);
    const mimeType = mime.lookup(filePath) || "application/octet-stream";

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "no-cache, max-age=0",
      },
    });
  } catch (error) {
    console.error("Profile image error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
