import { google } from "googleapis";
import { Readable } from "node:stream";
import { env } from "@/config/env";

const DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive.file"];

function hasDriveCredentials(): boolean {
  return Boolean(env.GOOGLE_CLIENT_EMAIL && env.GOOGLE_PRIVATE_KEY && env.GOOGLE_DRIVE_FOLDER_ID);
}

function createDriveAuth() {
  if (!hasDriveCredentials()) {
    return null;
  }

  return new google.auth.JWT({
    email: env.GOOGLE_CLIENT_EMAIL,
    key: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: DRIVE_SCOPES
  });
}

function toDataUrl(file: File, buffer: Buffer): string {
  const mimeType = file.type || "application/octet-stream";
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

/** Uploads an image to Google Drive and returns a public direct-view URL. */
export async function uploadImageToDrive(file: File): Promise<{ url: string; fileId: string }> {
  const auth = createDriveAuth();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (!auth || !env.GOOGLE_DRIVE_FOLDER_ID) {
    return {
      fileId: "",
      url: toDataUrl(file, buffer)
    };
  }

  const drive = google.drive({ auth, version: "v3" });
  const fileName = file.name?.trim() || `photo-${Date.now()}.jpg`;
  const uploaded = await drive.files.create({
    fields: "id, webViewLink, webContentLink",
    media: {
      mimeType: file.type || "image/jpeg",
      body: Readable.from(buffer)
    },
    requestBody: {
      name: fileName,
      parents: [env.GOOGLE_DRIVE_FOLDER_ID]
    },
    supportsAllDrives: true
  });

  const fileId = uploaded.data.id;
  if (!fileId) {
    return {
      fileId: "",
      url: toDataUrl(file, buffer)
    };
  }

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone"
    },
    supportsAllDrives: true
  });

  return {
    fileId,
    url: `https://drive.google.com/uc?export=view&id=${fileId}`
  };
}
