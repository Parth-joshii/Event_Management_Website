/** Checks whether a public asset path string is valid. */
export function publicAssetExists(publicPath?: string): boolean {
  return Boolean(publicPath && publicPath.trim().length > 0);
}

/** Returns a public path string safely without Node.js filesystem dependency. */
export function optionalPublicAsset(publicPath?: string): string | undefined {
  return publicAssetExists(publicPath) ? publicPath : undefined;
}
