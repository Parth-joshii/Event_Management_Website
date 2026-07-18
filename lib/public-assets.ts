import { existsSync } from "node:fs";
import { join } from "node:path";

/** Checks whether a public asset exists without exposing filesystem paths. */
export function publicAssetExists(publicPath: string): boolean {
  const normalizedPath = publicPath.replace(/^\/+/, "");
  return existsSync(join(process.cwd(), "public", normalizedPath));
}

/** Returns a public path only when its corresponding file exists. */
export function optionalPublicAsset(publicPath: string): string | undefined {
  return publicAssetExists(publicPath) ? publicPath : undefined;
}
