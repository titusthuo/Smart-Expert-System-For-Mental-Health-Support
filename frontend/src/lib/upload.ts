// @ts-ignore - apollo-upload-client types issue
import { ReactNativeFile } from "apollo-upload-client";

/**
 * Convert a local image URI to a ReactNativeFile object for GraphQL upload
 */
export function uriToFile(uri: string, filename?: string): ReactNativeFile {
  // Generate unique filename with timestamp if not provided
  const finalFilename = filename || `profile-${Date.now()}.jpg`;

  return new ReactNativeFile({
    uri,
    name: finalFilename,
    type: "image/jpeg",
  });
}

/**
 * Extract filename from URI
 */
export function getFilenameFromUri(uri: string): string {
  const parts = uri.split("/");
  const filename = parts[parts.length - 1];
  return filename || "photo.jpg";
}
