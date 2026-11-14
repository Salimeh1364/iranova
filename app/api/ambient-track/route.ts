import { access } from "node:fs/promises";
import path from "node:path";
import { connection, NextResponse } from "next/server";

// The recording lives with the other public files.
const TRACK = path.join(process.cwd(), "public", "audio", "iranian-ambient.mp3");

/**
 * Says whether the hall recording is on disk.
 * Always answers 200, so a missing file does not become a console 404.
 */
export async function GET() {
  // Read the disk on each request. A file added later should be found without a rebuild.
  await connection();
  try {
    await access(TRACK);
    return NextResponse.json({ ready: true });
  } catch {
    return NextResponse.json({ ready: false });
  }
}
